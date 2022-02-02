import { Client } from 'domain/entities/Client';
import { ClientStatus } from 'domain/enums/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { ArchiveClientOutput } from './ArchiveClientOutput';

@Service()
export class ArchiveClientHandler implements IUsecaseHandler<string, ArchiveClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string, usecaseOption: UsecaseOption): Promise<ArchiveClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new NotFoundError();

        const data = new Client();
        data.status = ClientStatus.Archived;
        data.archivedAt = new Date();

        return await this._dbContext.runTransaction(async querySession => {
            const updatedClient = await this._clientRepository.updateGet(id, data, querySession);
            if (updatedClient) {
                this._rabbitMQService.publishAccountEventUserUpdated({
                    id,
                    status: updatedClient.status,
                    firstName: updatedClient.firstName,
                    lastName: updatedClient.lastName,
                    avatar: updatedClient.avatar
                }, usecaseOption);
            }

            const result = new ArchiveClientOutput();
            result.data = true;
            return result;
        });
    }
}
