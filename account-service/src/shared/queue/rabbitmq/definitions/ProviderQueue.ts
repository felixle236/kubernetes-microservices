import { RABBITMQ_EXCHANGE, RABBITMQ_PREFIX } from 'config/Configuration';
import { RoutingQueue } from '../RoutingQueue';

export class ProviderQueue {
    // Define the routes with:
    // - The key name is the same event/command of this service, format: [env].[this-service-name].['event'/'cmd'].[event-name/command-name]
    //    • 'event' is used to synchronize data between microservices.
    //    • 'cmd' is used to request action between microservices.
    // - The queue name is the same action of other services, format: [env].[other-service-name].queue.[action-name]
    // - Key (1) -> (n) Queue
    static ROUTES = {
        USER_CREATED: {
            key: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.event.user-created`,
            queues: [
                `${RABBITMQ_PREFIX}.auth.queue.create-account`,
                `${RABBITMQ_PREFIX}.chat.queue.create-account`,
                `${RABBITMQ_PREFIX}.notification.queue.create-account`
            ]
        } as RoutingQueue,
        USER_UPDATED: {
            key: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.event.user-updated`,
            queues: [
                `${RABBITMQ_PREFIX}.auth.queue.update-account`,
                `${RABBITMQ_PREFIX}.chat.queue.update-account`,
                `${RABBITMQ_PREFIX}.notification.queue.update-account`
            ]
        } as RoutingQueue,
        USER_DELETED: {
            key: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.event.user-deleted`,
            queues: [
                `${RABBITMQ_PREFIX}.auth.queue.delete-account`,
                `${RABBITMQ_PREFIX}.chat.queue.delete-account`,
                `${RABBITMQ_PREFIX}.notification.queue.delete-account`
            ]
        } as RoutingQueue,
        SEND_ACCOUNT_ACTIVATION: {
            key: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.cmd.send-account-activation`,
            queues: [
                `${RABBITMQ_PREFIX}.notification.queue.send-account-activation`
            ]
        } as RoutingQueue,
        RESEND_ACCOUNT_ACTIVATION: {
            key: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.cmd.resend-account-activation`,
            queues: [
                `${RABBITMQ_PREFIX}.notification.queue.resend-account-activation`
            ]
        } as RoutingQueue
    };
}
