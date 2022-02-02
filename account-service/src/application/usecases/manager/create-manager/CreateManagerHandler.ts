import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/Manager';
import { ManagerStatus } from 'domain/enums/ManagerStatus';
import { RoleId } from 'domain/enums/RoleId';
import { IManagerRepository } from 'application/interfaces/repositories/IManagerRepository';
import { IAuthenticationService } from 'application/interfaces/services/IAuthenticationService';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateManagerInput } from './CreateManagerInput';
import { CreateManagerOutput } from './CreateManagerOutput';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';

@Service()
export class CreateManagerHandler implements IUsecaseHandler<CreateManagerInput, CreateManagerOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectService.Auth) private readonly _authenticationService: IAuthenticationService,
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(param: CreateManagerInput, usecaseOption: UsecaseOption): Promise<CreateManagerOutput> {
        const data = new Manager();
        data.id = randomUUID();
        data.roleId = RoleId.Manager;
        data.status = ManagerStatus.Actived;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        return await this._dbContext.runTransaction(async querySession => {
            const id = await this._managerRepository.create(data, querySession);
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

            const result = new CreateManagerOutput();
            result.data = id;
            return result;
        });
    }
}
