import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { IAuthDeleteUserPayload } from '@shared/queue/provide/payloads/auth/IAuthDeleteUserPayload';
import { IChatDeleteUserPayload } from '@shared/queue/provide/payloads/chat/IChatDeleteUserPayload';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { Inject, Service } from 'typedi';
import { DeleteManagerCommandOutput } from './DeleteManagerCommandOutput';

@Service()
export class DeleteManagerCommandHandler extends CommandHandler<string, DeleteManagerCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string, handleOption: HandleOption): Promise<DeleteManagerCommandOutput> {
        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._managerRepository.softDelete(id, queryRunner);
            if (hasSucceed) {
                const payload: IAuthDeleteUserPayload | IChatDeleteUserPayload = {
                    id
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_DELETED, payload, {}, handleOption);
            }
            const result = new DeleteManagerCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
