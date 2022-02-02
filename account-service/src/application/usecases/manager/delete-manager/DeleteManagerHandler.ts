import { IManagerRepository } from 'application/interfaces/repositories/IManagerRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { DeleteManagerOutput } from './DeleteManagerOutput';

@Service()
export class DeleteManagerHandler implements IUsecaseHandler<string, DeleteManagerOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string, usecaseOption: UsecaseOption): Promise<DeleteManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new NotFoundError();

        return await this._dbContext.runTransaction(async querySession => {
            const hasSucceed = await this._managerRepository.softDelete(id, querySession);
            if (hasSucceed)
                this._rabbitMQService.publishAccountEventUserDeleted({ id }, usecaseOption);

            const result = new DeleteManagerOutput();
            result.data = hasSucceed;
            return result;
        });
    }
}
