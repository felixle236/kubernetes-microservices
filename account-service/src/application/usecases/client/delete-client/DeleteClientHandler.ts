import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { DeleteClientOutput } from './DeleteClientOutput';

@Service()
export class DeleteClientHandler implements IUsecaseHandler<string, DeleteClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string, usecaseOption: UsecaseOption): Promise<DeleteClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new NotFoundError();

        return await this._dbContext.runTransaction(async querySession => {
            const hasSucceed = await this._clientRepository.softDelete(id, querySession);
            if (hasSucceed)
                this._rabbitMQService.publishAccountEventUserDeleted({ id }, usecaseOption);

            const result = new DeleteClientOutput();
            result.data = hasSucceed;
            return result;
        });
    }
}
