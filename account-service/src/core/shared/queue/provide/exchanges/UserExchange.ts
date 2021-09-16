import { IRoutingQueue } from '../../interfaces/IRoutingQueue';

export class UserExchange {
    // The domain in DDD concept.
    static EXCHANGE = 'user';

    // The jobs need to process by other microservices that they contained into the queues.
    static QUEUES = {
        AUTH_QUEUE_SYNC_USER: 'auth.queue.sync-user',
        CHAT_QUEUE_SYNC_USER: 'chat.queue.sync-user',
        NOTIFICATION_QUEUE_SEND_USER_ACTIVATION: 'notification.queue.send-user-activation'
    };

    // Define the keys that their name are the same an action, an usecase may have one or many action.
    static KEYS = {
        USER_EVENT_CREATED: 'user.event.created',
        USER_EVENT_UPDATED: 'user.event.updated',
        USER_EVENT_DELETED: 'user.event.deleted',
        USER_EVENT_STATUS_UPDATED: 'user.event.status-updated',
        USER_EVENT_AVATAR_UPDATED: 'user.event.avatar-updated',
        USER_CMD_SEND_USER_ACTIVATION: 'user.cmd.send-user-activation',
        USER_CMD_RESEND_USER_ACTIVATION: 'user.cmd.resend-user-activation'
    };

    // Define routings for the exchange route to queues. Queue field is required, keys field only require for publishers, no need for consumers.
    static ROUTINGS: IRoutingQueue[] = [{
        queue: UserExchange.QUEUES.AUTH_QUEUE_SYNC_USER,
        keys: [
            UserExchange.KEYS.USER_EVENT_CREATED,
            UserExchange.KEYS.USER_EVENT_UPDATED,
            UserExchange.KEYS.USER_EVENT_DELETED,
            UserExchange.KEYS.USER_EVENT_STATUS_UPDATED
        ]
    }, {
        queue: UserExchange.QUEUES.CHAT_QUEUE_SYNC_USER,
        keys: [
            UserExchange.KEYS.USER_EVENT_CREATED,
            UserExchange.KEYS.USER_EVENT_UPDATED,
            UserExchange.KEYS.USER_EVENT_DELETED,
            UserExchange.KEYS.USER_EVENT_STATUS_UPDATED,
            UserExchange.KEYS.USER_EVENT_AVATAR_UPDATED
        ]
    }, {
        queue: UserExchange.QUEUES.NOTIFICATION_QUEUE_SEND_USER_ACTIVATION,
        keys: [
            UserExchange.KEYS.USER_CMD_SEND_USER_ACTIVATION,
            UserExchange.KEYS.USER_CMD_RESEND_USER_ACTIVATION
        ]
    }];
}
