import { Manager } from 'domain/entities/Manager';
import { ManagerStatus } from 'domain/enums/ManagerStatus';
import { IManagerRepository } from 'application/interfaces/repositories/IManagerRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { ArchiveManagerOutput } from './ArchiveManagerOutput';

@Service()
export class ArchiveManagerHandler implements IUsecaseHandler<string, ArchiveManagerOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string, usecaseOption: UsecaseOption): Promise<ArchiveManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new NotFoundError();

        const data = new Manager();
        data.status = ManagerStatus.Archived;
        data.archivedAt = new Date();

        return await this._dbContext.runTransaction(async querySession => {
            const updatedManager = await this._managerRepository.updateGet(id, data, querySession);
            if (updatedManager) {
                this._rabbitMQService.publishAccountEventUserUpdated({
                    id,
                    status: updatedManager.status,
                    firstName: updatedManager.firstName,
                    lastName: updatedManager.lastName,
                    avatar: updatedManager.avatar
                }, usecaseOption);
            }

            const result = new ArchiveManagerOutput();
            result.data = true;
            return result;
        });
    }
}
