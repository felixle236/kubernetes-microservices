import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IAuthenticationService } from '@gateways/services/IAuthenticationService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { IAuthCreateUserPayload } from '@shared/queue/provide/payloads/auth/IAuthCreateUserPayload';
import { IChatCreateUserPayload } from '@shared/queue/provide/payloads/chat/IChatCreateUserPayload';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { CheckEmailExistQueryHandler } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateManagerCommandInput } from './CreateManagerCommandInput';
import { CreateManagerCommandOutput } from './CreateManagerCommandOutput';

@Service()
export class CreateManagerCommandHandler extends CommandHandler<CreateManagerCommandInput, CreateManagerCommandOutput> {
    @Inject()
    private readonly _checkEmailExistQueryHandler: CheckEmailExistQueryHandler;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: CreateManagerCommandInput, handleOption: HandleOption): Promise<CreateManagerCommandOutput> {
        await validateDataInput(param);

        const data = new Manager();
        data.roleId = RoleId.Manager;
        data.status = ManagerStatus.Actived;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const checkEmailResult = await this._checkEmailExistQueryHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const id = await this._managerRepository.create(data, queryRunner);
            const hasSucceed = await this._authenticationService.createUserAuth({
                userId: id,
                email: data.email,
                password: param.password
            }, handleOption);

            if (!hasSucceed)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE);

            const userPayload: IAuthCreateUserPayload | IChatCreateUserPayload = {
                id,
                roleId: data.roleId,
                status: data.status,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            };
            this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_CREATED, userPayload, {}, handleOption);

            const result = new CreateManagerCommandOutput();
            result.setData(id);
            return result;
        });
    }
}
