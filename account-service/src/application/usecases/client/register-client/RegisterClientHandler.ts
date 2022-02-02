import { randomBytes, randomUUID } from 'crypto';
import { Client } from 'domain/entities/Client';
import { ClientStatus } from 'domain/enums/ClientStatus';
import { RoleId } from 'domain/enums/RoleId';
import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IAuthenticationService } from 'application/interfaces/services/IAuthenticationService';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { addSeconds } from 'utils/Datetime';
import { RegisterClientInput } from './RegisterClientInput';
import { RegisterClientOutput } from './RegisterClientOutput';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';

@Service()
export class RegisterClientHandler implements IUsecaseHandler<RegisterClientInput, RegisterClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectService.Auth) private readonly _authenticationService: IAuthenticationService,
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(param: RegisterClientInput, usecaseOption: UsecaseOption): Promise<RegisterClientOutput> {
        const data = new Client();
        data.id = randomUUID();
        data.roleId = RoleId.Client;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const activeKey = randomBytes(32).toString('hex');
        const activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        data.status = ClientStatus.Inactived;
        data.activeKey = activeKey;
        data.activeExpire = activeExpire;

        const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        return await this._dbContext.runTransaction(async querySession => {
            const id = await this._clientRepository.create(data, querySession);
            const hasSucceed = await this._authenticationService.createUserAuth({
                userId: id,
                email: data.email,
                password: param.password
            }, usecaseOption);

            if (!hasSucceed)
                throw new LogicalError(MessageError.DATA_CANNOT_SAVE);

            this._rabbitMQService.publishAccountEventUserCreated({
                id,
                roleId: data.roleId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                status: data.status
            }, usecaseOption);

            this._rabbitMQService.publishAccountCmdSendActivation({
                name: data.firstName,
                email: data.email,
                activeKey
            }, usecaseOption);

            const result = new RegisterClientOutput();
            result.data = true;
            return result;
        });
    }
}
