import { ENV } from '@configs/Configuration';
import { IRoutingQueue } from '../../interfaces/IRoutingQueue';

const prefix = ENV + '.';

export class UserExchange {
    // The domain in DDD concept.
    static EXCHANGE = prefix + 'user';

    // The jobs need to process by other microservices that they contained into the queues.
    static QUEUES = {
        AUTH_QUEUE_SYNC_USER: prefix + 'auth.queue.sync-user',
        CHAT_QUEUE_SYNC_USER: prefix + 'chat.queue.sync-user',
        NOTIFICATION_QUEUE_SEND_USER_ACTIVATION: prefix + 'notification.queue.send-user-activation'
    };

    // Define the keys that their name are the same an action, an usecase may have one or many action.
    static KEYS = {
        USER_EVENT_CREATED: prefix + 'user.event.created',
        USER_EVENT_UPDATED: prefix + 'user.event.updated',
        USER_EVENT_DELETED: prefix + 'user.event.deleted',
        USER_EVENT_STATUS_UPDATED: prefix + 'user.event.status-updated',
        USER_EVENT_AVATAR_UPDATED: prefix + 'user.event.avatar-updated',
        USER_CMD_SEND_USER_ACTIVATION: prefix + 'user.cmd.send-user-activation',
        USER_CMD_RESEND_USER_ACTIVATION: prefix + 'user.cmd.resend-user-activation'
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
