import { IRoutingQueue } from '../../interfaces/IRoutingQueue';

export class AuthExchange {
    static EXCHANGE = 'auth';

    static QUEUES = {
        NOTIFICATION_QUEUE_FORGOT_PASSWORD: 'notification.queue.forgot-password'
    };

    static KEYS = {
        AUTH_EVENT_FORGOT_PASSWORD: 'auth.event.forgot-password'
    };

    static ROUTINGS: IRoutingQueue[] = [{
        queue: AuthExchange.QUEUES.NOTIFICATION_QUEUE_FORGOT_PASSWORD,
        keys: [
            AuthExchange.KEYS.AUTH_EVENT_FORGOT_PASSWORD
        ]
    }];
}
