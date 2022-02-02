import { randomUUID } from 'crypto';
import { Client } from 'domain/entities/Client';
import { ClientStatus } from 'domain/enums/ClientStatus';
import { RoleId } from 'domain/enums/RoleId';
import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IAuthenticationService } from 'application/interfaces/services/IAuthenticationService';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectService, InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateClientInput } from './CreateClientInput';
import { CreateClientOutput } from './CreateClientOutput';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';

@Service()
export class CreateClientHandler implements IUsecaseHandler<CreateClientInput, CreateClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectService.Auth) private readonly _authenticationService: IAuthenticationService,
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(param: CreateClientInput, usecaseOption: UsecaseOption): Promise<CreateClientOutput> {
        const data = new Client();
        data.id = randomUUID();
        data.roleId = RoleId.Client;
        data.status = ClientStatus.Actived;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

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
                id: data.id,
                roleId: data.roleId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                status: data.status
            }, usecaseOption);

            const result = new CreateClientOutput();
            result.data = id;
            return result;
        });
    }
}
