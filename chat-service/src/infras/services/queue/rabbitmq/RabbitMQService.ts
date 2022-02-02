import './RabbitMQContext';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { ProviderQueue } from 'shared/queue/rabbitmq/definitions/ProviderQueue';
import { IRabbitMQContext } from 'shared/queue/rabbitmq/IRabbitMQContext';
import { InjectService, InjectQueue } from 'shared/types/Injection';
import { Inject, Service } from 'typedi';

@Service(InjectService.RabbitMQService)
export class RabbitMQService implements IRabbitMQService {
    constructor(
        @Inject(InjectQueue.RabbitMQContext) private readonly _rabbitMQContext: IRabbitMQContext
    ) {
        this._rabbitMQContext.initProviderQueues(ProviderQueue.ROUTES);
    }
}
