import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { IAuthUpdateUserStatusPayload } from '@shared/queue/provide/payloads/auth/IAuthUpdateUserStatusPayload';
import { IChatUpdateUserStatusPayload } from '@shared/queue/provide/payloads/chat/IChatUpdateUserStatusPayload';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { Inject, Service } from 'typedi';
import { ArchiveManagerCommandOutput } from './ArchiveManagerCommandOutput';

@Service()
export class ArchiveManagerCommandHandler extends CommandHandler<string, ArchiveManagerCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string, handleOption: HandleOption): Promise<ArchiveManagerCommandOutput> {
        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Manager();
        data.status = ManagerStatus.Archived;
        data.archivedAt = new Date();

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._managerRepository.update(id, data, queryRunner);
            if (hasSucceed) {
                const payload: IAuthUpdateUserStatusPayload | IChatUpdateUserStatusPayload = {
                    id,
                    status: data.status
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_STATUS_UPDATED, payload, {}, handleOption);
            }
            const result = new ArchiveManagerCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
