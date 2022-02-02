import { Client } from 'domain/entities/Client';
import { ClientStatus } from 'domain/enums/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { ActiveClientInput } from './ActiveClientInput';
import { ActiveClientOutput } from './ActiveClientOutput';

@Service()
export class ActiveClientHandler implements IUsecaseHandler<ActiveClientInput, ActiveClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(param: ActiveClientInput, usecaseOption: UsecaseOption): Promise<ActiveClientOutput> {
        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.activeKey !== param.activeKey || client.status === ClientStatus.Actived)
            throw new LogicalError(MessageError.DATA_INVALID);

        if (!client.activeExpire || client.activeExpire < new Date())
            throw new LogicalError(MessageError.PARAM_EXPIRED, { t: 'activation_key' });

        const data = new Client();
        data.status = ClientStatus.Actived;
        data.activedAt = new Date();
        data.activeKey = '';
        data.activeExpire = undefined;

        return await this._dbContext.runTransaction(async querySession => {
            const updatedClient = await this._clientRepository.updateGet(client.id, data, querySession);
            if (updatedClient) {
                this._rabbitMQService.publishAccountEventUserUpdated({
                    id: client.id,
                    status: updatedClient.status,
                    firstName: updatedClient.firstName,
                    lastName: updatedClient.lastName,
                    avatar: updatedClient.avatar
                }, usecaseOption);
            }

            const result = new ActiveClientOutput();
            result.data = true;
            return result;
        });
    }
}
