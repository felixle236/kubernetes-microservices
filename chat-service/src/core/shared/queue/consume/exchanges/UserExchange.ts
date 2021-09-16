export class UserExchange {
    // The domain in DDD concept.
    static EXCHANGE = 'user';

    // The jobs need to process by other microservices that they contained into the queues.
    static QUEUES = {
        CHAT_QUEUE_SYNC_USER: 'chat.queue.sync-user'
    };

    // Define the keys that their name are the same an action, an usecase may have one or many action.
    static KEYS = {
        USER_EVENT_CREATED: 'user.event.created',
        USER_EVENT_UPDATED: 'user.event.updated',
        USER_EVENT_DELETED: 'user.event.deleted',
        USER_EVENT_STATUS_UPDATED: 'user.event.status-updated',
        USER_EVENT_AVATAR_UPDATED: 'user.event.avatar-updated'
    };
}
