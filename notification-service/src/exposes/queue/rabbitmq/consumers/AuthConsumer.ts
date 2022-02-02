import { ForgotPasswordByEmailHandler } from 'application/usecases/mail/forgot-password-by-email/ForgotPasswordByEmailHandler';
import { ForgotPasswordByEmailInput } from 'application/usecases/mail/forgot-password-by-email/ForgotPasswordByEmailInput';
import { AddUserDeviceTokenHandler } from 'application/usecases/user/add-user-device-token/AddUserDeviceTokenHandler';
import { AddUserDeviceTokenInput } from 'application/usecases/user/add-user-device-token/AddUserDeviceTokenInput';
import { RemoveUserDeviceTokenHandler } from 'application/usecases/user/remove-user-device-token/RemoveUserDeviceTokenHandler';
import { RemoveUserDeviceTokenInput } from 'application/usecases/user/remove-user-device-token/RemoveUserDeviceTokenInput';
import { ConsumerQueue } from 'shared/queue/rabbitmq/definitions/ConsumerQueue';
import { IRabbitMQContext } from 'shared/queue/rabbitmq/IRabbitMQContext';
import { InjectQueue } from 'shared/types/Injection';
import { Inject, Service } from 'typedi';
import { validateDataInput } from 'utils/Validator';
import { AuthEventForgotPasswordPayload, AuthEventUpdateDeviceTokenPayload } from '../payloads/AuthConsumerPayload';

@Service()
export default class AuthConsumer {
    constructor(
        @Inject(InjectQueue.RabbitMQContext) private readonly _rabbitMQContext: IRabbitMQContext,
        @Inject() private readonly _addUserDeviceTokenHandler: AddUserDeviceTokenHandler,
        @Inject() private readonly _removeUserDeviceTokenHandler: RemoveUserDeviceTokenHandler,
        @Inject() private readonly _forgotPasswordByEmailHandler: ForgotPasswordByEmailHandler
    ) {}

    async init(): Promise<void> {
        await this._rabbitMQContext.initConsumerQueues(ConsumerQueue.QUEUES);

        await this._rabbitMQContext.consume<AuthEventForgotPasswordPayload>(ConsumerQueue.QUEUES.FORGOT_PASSWORD, async (_channel, _key, _msg, payload, usecaseOption) => {
            const param = new ForgotPasswordByEmailInput();
            param.name = payload.name;
            param.email = payload.email;
            param.forgotKey = payload.forgotKey;

            await validateDataInput(param);
            await this._forgotPasswordByEmailHandler.handle(param, usecaseOption);
        });

        await this._rabbitMQContext.consume<AuthEventUpdateDeviceTokenPayload>(ConsumerQueue.QUEUES.ADD_DEVICE_TOKEN, async (_channel, _key, _msg, payload, _usecaseOption) => {
            const param = new AddUserDeviceTokenInput();
            param.deviceToken = payload.deviceToken;
            param.deviceExpire = payload.deviceExpire;

            await validateDataInput(param);
            await this._addUserDeviceTokenHandler.handle(payload.userId, param);
        });

        await this._rabbitMQContext.consume<AuthEventUpdateDeviceTokenPayload>(ConsumerQueue.QUEUES.REMOVE_DEVICE_TOKEN, async (_channel, _key, _msg, payload, _usecaseOption) => {
            const param = new RemoveUserDeviceTokenInput();
            param.deviceToken = payload.deviceToken;

            await validateDataInput(param);
            await this._removeUserDeviceTokenHandler.handle(payload.userId, param);
        });
    }
}
