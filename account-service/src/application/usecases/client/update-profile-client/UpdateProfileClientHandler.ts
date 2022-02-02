import { Client } from 'domain/entities/Client';
import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { UpdateProfileClientInput } from './UpdateProfileClientInput';
import { UpdateProfileClientOutput } from './UpdateProfileClientOutput';

@Service()
export class UpdateProfileClientHandler implements IUsecaseHandler<UpdateProfileClientInput, UpdateProfileClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string, param: UpdateProfileClientInput, usecaseOption: UsecaseOption): Promise<UpdateProfileClientOutput> {
        const data = new Client();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

        const client = await this._clientRepository.get(id);
        if (!client)
            throw new NotFoundError();

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
            const result = new UpdateProfileClientOutput();
            result.data = true;
            return result;
        });
    }
}
