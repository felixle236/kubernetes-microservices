import './RabbitMQContext';
import { AccountCmdSendActivationPayload, AccountEventCreatedPayload, AccountEventDeletedPayload, AccountEventUpdatedPayload, IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { ProviderQueue } from 'shared/queue/rabbitmq/definitions/ProviderQueue';
import { IRabbitMQContext } from 'shared/queue/rabbitmq/IRabbitMQContext';
import { InjectService, InjectQueue } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';

@Service(InjectService.RabbitMQService)
export class RabbitMQService implements IRabbitMQService {
    constructor(
        @Inject(InjectQueue.RabbitMQContext) private readonly _rabbitMQContext: IRabbitMQContext
    ) {
        this._rabbitMQContext.initProviderQueues(ProviderQueue.ROUTES);
    }

    publishAccountEventUserCreated(payload: AccountEventCreatedPayload, usecaseOption: UsecaseOption): boolean {
        return this._rabbitMQContext.publish(ProviderQueue.ROUTES.USER_CREATED.key, payload, usecaseOption);
    }

    publishAccountEventUserUpdated(payload: AccountEventUpdatedPayload, usecaseOption: UsecaseOption): boolean {
        return this._rabbitMQContext.publish(ProviderQueue.ROUTES.USER_UPDATED.key, payload, usecaseOption);
    }

    publishAccountEventUserDeleted(payload: AccountEventDeletedPayload, usecaseOption: UsecaseOption): boolean {
        return this._rabbitMQContext.publish(ProviderQueue.ROUTES.USER_DELETED.key, payload, usecaseOption);
    }

    publishAccountCmdSendActivation(payload: AccountCmdSendActivationPayload, usecaseOption: UsecaseOption): boolean {
        return this._rabbitMQContext.publish(ProviderQueue.ROUTES.SEND_ACCOUNT_ACTIVATION.key, payload, usecaseOption);
    }

    publishAccountCmdResendActivation(payload: AccountCmdSendActivationPayload, usecaseOption: UsecaseOption): boolean {
        return this._rabbitMQContext.publish(ProviderQueue.ROUTES.RESEND_ACCOUNT_ACTIVATION.key, payload, usecaseOption);
    }
}
