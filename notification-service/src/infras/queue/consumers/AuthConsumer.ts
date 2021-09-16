import { AuthExchange } from '@shared/queue/consume/exchanges/AuthExchange';
import { IForgotPasswordPayload } from '@shared/queue/consume/payloads/auth/IForgotPasswordPayload';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { ForgotPasswordByEmailCommandHandler } from '@usecases/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandHandler';
import { ForgotPasswordByEmailCommandInput } from '@usecases/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandInput';
import { Inject, Service } from 'typedi';

@Service()
export default class AuthConsumer {
    @Inject()
    private readonly _forgotPasswordByEmailCommandHandler: ForgotPasswordByEmailCommandHandler;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    async init(): Promise<void> {
        await this._queueContext.consumeQueues(AuthExchange.EXCHANGE, Object.values(AuthExchange.QUEUES));

        await this._queueContext.consume(AuthExchange.QUEUES.NOTIFICATION_QUEUE_FORGOT_PASSWORD, async (_channel, _key, _msg, payload, handleOption) => {
            const param = new ForgotPasswordByEmailCommandInput();
            const obj = payload as IForgotPasswordPayload;
            param.id = obj.id;
            param.firstName = obj.firstName;
            param.lastName = obj.lastName;
            param.email = obj.email;
            param.forgotKey = obj.forgotKey;
            param.forgotExpire = obj.forgotExpire;

            await this._forgotPasswordByEmailCommandHandler.handle(param, handleOption);
        });
    }
}
