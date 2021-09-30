import { ENV } from '@configs/Configuration';

const prefix = ENV + '.';

export class UserExchange {
    // The domain in DDD concept.
    static EXCHANGE = prefix + 'user';

    // The jobs need to process by other microservices that they contained into the queues.
    static QUEUES = {
        CHAT_QUEUE_SYNC_USER: prefix + 'chat.queue.sync-user'
    };

    // Define the keys that their name are the same an action, an usecase may have one or many action.
    static KEYS = {
        USER_EVENT_CREATED: prefix + 'user.event.created',
        USER_EVENT_UPDATED: prefix + 'user.event.updated',
        USER_EVENT_DELETED: prefix + 'user.event.deleted',
        USER_EVENT_STATUS_UPDATED: prefix + 'user.event.status-updated',
        USER_EVENT_AVATAR_UPDATED: prefix + 'user.event.avatar-updated'
    };
}
