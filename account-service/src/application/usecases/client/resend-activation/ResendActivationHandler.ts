import { randomBytes } from 'crypto';
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
import { addSeconds } from 'utils/Datetime';
import { ResendActivationInput } from './ResendActivationInput';
import { ResendActivationOutput } from './ResendActivationOutput';

@Service()
export class ResendActivationHandler implements IUsecaseHandler<ResendActivationInput, ResendActivationOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(param: ResendActivationInput, usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.status === ClientStatus.Actived)
            throw new LogicalError(MessageError.DATA_INVALID);

        const activeKey = randomBytes(32).toString('hex');
        const activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const data = new Client();
        data.activeKey = activeKey;
        data.activeExpire = activeExpire;

        return await this._dbContext.runTransaction(async querySession => {
            const hasSucceed = await this._clientRepository.update(client.id, data, querySession);
            if (hasSucceed) {
                this._rabbitMQService.publishAccountCmdResendActivation({
                    name: client.firstName,
                    email: data.email,
                    activeKey
                }, usecaseOption);
            }
            const result = new ResendActivationOutput();
            result.data = hasSucceed;
            return result;
        });
    }
}
