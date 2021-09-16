export class AuthExchange {
    static EXCHANGE = 'auth';

    static QUEUES = {
        NOTIFICATION_QUEUE_FORGOT_PASSWORD: 'notification.queue.forgot-password'
    };

    static KEYS = {
        AUTH_EVENT_FORGOT_PASSWORD: 'auth.event.forgot-password'
    };
}
