import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
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
import { DeleteClientCommandOutput } from './DeleteClientCommandOutput';

@Service()
export class DeleteClientCommandHandler extends CommandHandler<string, DeleteClientCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string, handleOption: HandleOption): Promise<DeleteClientCommandOutput> {
        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._clientRepository.softDelete(id, queryRunner);
            if (hasSucceed) {
                const payload: IAuthDeleteUserPayload | IChatDeleteUserPayload = {
                    id
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_DELETED, payload, {}, handleOption);
            }
            const result = new DeleteClientCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
