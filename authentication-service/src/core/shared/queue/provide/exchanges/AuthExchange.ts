import { ENV } from '@configs/Configuration';
import { IRoutingQueue } from '../../interfaces/IRoutingQueue';

const prefix = ENV + '.';

export class AuthExchange {
    static EXCHANGE = prefix + 'auth';

    static QUEUES = {
        NOTIFICATION_QUEUE_FORGOT_PASSWORD: prefix + 'notification.queue.forgot-password'
    };

    static KEYS = {
        AUTH_EVENT_FORGOT_PASSWORD: prefix + 'auth.event.forgot-password'
    };

    static ROUTINGS: IRoutingQueue[] = [{
        queue: AuthExchange.QUEUES.NOTIFICATION_QUEUE_FORGOT_PASSWORD,
        keys: [
            AuthExchange.KEYS.AUTH_EVENT_FORGOT_PASSWORD
        ]
    }];
}
