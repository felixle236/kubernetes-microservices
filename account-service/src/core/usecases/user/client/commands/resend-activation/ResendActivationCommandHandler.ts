import crypto from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { INotificationResendUserActivation } from '@shared/queue/provide/payloads/notification/INotificationResendUserActivation';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { addSeconds } from '@utils/datetime';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ResendActivationCommandInput } from './ResendActivationCommandInput';
import { ResendActivationCommandOutput } from './ResendActivationCommandOutput';

@Service()
export class ResendActivationCommandHandler extends CommandHandler<ResendActivationCommandInput, ResendActivationCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: ResendActivationCommandInput, handleOption: HandleOption): Promise<ResendActivationCommandOutput> {
        await validateDataInput(param);

        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.status === ClientStatus.Actived)
            throw new SystemError(MessageError.DATA_INVALID);

        const activeKey = crypto.randomBytes(32).toString('hex');
        const activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const data = new Client();
        data.activeKey = activeKey;
        data.activeExpire = activeExpire;

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._clientRepository.update(client.id, data, queryRunner);
            if (hasSucceed) {
                const payload: INotificationResendUserActivation = {
                    id: client.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    activeKey,
                    activeExpire: activeExpire.toString()
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_CMD_RESEND_USER_ACTIVATION, payload, {}, handleOption);
            }
            const result = new ResendActivationCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
