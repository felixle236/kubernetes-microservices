import { RABBITMQ_PREFIX, RABBITMQ_EXCHANGE } from 'config/Configuration';
import { RoutingQueue } from '../RoutingQueue';

export class ProviderQueue {
    // Define the routes with:
    // - The key name is the same event/command of this service, format: [env].[this-service-name].['event'/'cmd'].[event-name/command-name]
    //    • 'event' is used to synchronize data between microservices.
    //    • 'cmd' is used to request action between microservices.
    // - The queue name is the same action of other services, format: [env].[other-service-name].queue.[action-name]
    // - Key (1) -> (n) Queue
    static ROUTES = {
        FORGOT_PASSWORD: {
            key: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.cmd.forgot-password`,
            queues: [
                `${RABBITMQ_PREFIX}.notification.queue.forgot-password`
            ]
        } as RoutingQueue
    };
}
