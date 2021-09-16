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
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ActiveClientCommandInput } from './ActiveClientCommandInput';
import { ActiveClientCommandOutput } from './ActiveClientCommandOutput';

@Service()
export class ActiveClientCommandHandler extends CommandHandler<ActiveClientCommandInput, ActiveClientCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: ActiveClientCommandInput, handleOption: HandleOption): Promise<ActiveClientCommandOutput> {
        await validateDataInput(param);

        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.activeKey !== param.activeKey || client.status === ClientStatus.Actived)
            throw new SystemError(MessageError.DATA_INVALID);

        if (!client.activeExpire || client.activeExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'activation key');

        const data = new Client();
        data.status = ClientStatus.Actived;
        data.activeKey = null;
        data.activedAt = new Date();

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._clientRepository.update(client.id, data, queryRunner);
            if (hasSucceed) {
                const payload: IAuthUpdateUserStatusPayload | IChatUpdateUserStatusPayload = {
                    id: client.id,
                    status: data.status
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_STATUS_UPDATED, payload, {}, handleOption);
            }
            const result = new ActiveClientCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
