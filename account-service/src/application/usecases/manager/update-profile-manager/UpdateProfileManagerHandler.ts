import { Manager } from 'domain/entities/Manager';
import { IManagerRepository } from 'application/interfaces/repositories/IManagerRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { UpdateProfileManagerInput } from './UpdateProfileManagerInput';
import { UpdateProfileManagerOutput } from './UpdateProfileManagerOutput';

@Service()
export class UpdateProfileManagerHandler implements IUsecaseHandler<UpdateProfileManagerInput, UpdateProfileManagerOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string, param: UpdateProfileManagerInput, usecaseOption: UsecaseOption): Promise<UpdateProfileManagerOutput> {
        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;

        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new NotFoundError();

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
            const result = new UpdateProfileManagerOutput();
            result.data = true;
            return result;
        });
    }
}
