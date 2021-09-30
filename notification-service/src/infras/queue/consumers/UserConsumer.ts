import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UserExchange } from '@shared/queue/consume/exchanges/UserExchange';
import { IResendUserActivation } from '@shared/queue/consume/payloads/user/IResendUserActivation';
import { ISendUserActivation } from '@shared/queue/consume/payloads/user/ISendUserActivation';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { ResendUserActivationCommandHandler } from '@usecases/user/commands/resend-user-activation/ResendUserActivationCommandHandler';
import { ResendUserActivationCommandInput } from '@usecases/user/commands/resend-user-activation/ResendUserActivationCommandInput';
import { SendUserActivationCommandHandler } from '@usecases/user/commands/send-user-activation/SendUserActivationCommandHandler';
import { SendUserActivationCommandInput } from '@usecases/user/commands/send-user-activation/SendUserActivationCommandInput';
import { Inject, Service } from 'typedi';

@Service()
export default class UserConsumer {
    @Inject()
    private readonly _sendUserActivationCommandHandler: SendUserActivationCommandHandler;

    @Inject()
    private readonly _resendUserActivationCommandHandler: ResendUserActivationCommandHandler;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    async init(): Promise<void> {
        await this._queueContext.consumeQueues(UserExchange.EXCHANGE, Object.values(UserExchange.QUEUES));

        await this._queueContext.consume(UserExchange.QUEUES.NOTIFICATION_QUEUE_SEND_USER_ACTIVATION, async (_channel, key, _msg, payload, handleOption) => {
            if (key === UserExchange.KEYS.USER_CMD_SEND_USER_ACTIVATION) {
                const param = new SendUserActivationCommandInput();
                const obj = payload as ISendUserActivation;
                param.id = obj.id;
                param.firstName = obj.firstName;
                param.lastName = obj.lastName;
                param.email = obj.email;
                param.activeKey = obj.activeKey;
                param.activeExpire = obj.activeExpire;

                await this._sendUserActivationCommandHandler.handle(param, handleOption);
            }
            else if (key === UserExchange.KEYS.USER_CMD_RESEND_USER_ACTIVATION) {
                const param = new ResendUserActivationCommandInput();
                const obj = payload as IResendUserActivation;
                param.id = obj.id;
                param.firstName = obj.firstName;
                param.lastName = obj.lastName;
                param.email = obj.email;
                param.activeKey = obj.activeKey;
                param.activeExpire = obj.activeExpire;

                await this._resendUserActivationCommandHandler.handle(param, handleOption);
            }
            else
                throw new SystemError(MessageError.PARAM_NOT_FOUND, 'routing key');
        });
    }
}
