import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
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
import { ArchiveClientCommandOutput } from './ArchiveClientCommandOutput';

@Service()
export class ArchiveClientCommandHandler extends CommandHandler<string, ArchiveClientCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string, handleOption: HandleOption): Promise<ArchiveClientCommandOutput> {
        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Client();
        data.status = ClientStatus.Archived;
        data.archivedAt = new Date();

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._clientRepository.update(id, data, queryRunner);
            if (hasSucceed) {
                const payload: IAuthUpdateUserStatusPayload | IChatUpdateUserStatusPayload = {
                    id: client.id,
                    status: data.status
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_STATUS_UPDATED, payload, {}, handleOption);
            }
            const result = new ArchiveClientCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
