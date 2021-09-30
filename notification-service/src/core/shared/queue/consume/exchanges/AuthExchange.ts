import { ENV } from '@configs/Configuration';

const prefix = ENV + '.';

export class AuthExchange {
    static EXCHANGE = prefix + 'auth';

    static QUEUES = {
        NOTIFICATION_QUEUE_FORGOT_PASSWORD: prefix + 'notification.queue.forgot-password'
    };

    static KEYS = {
        AUTH_EVENT_FORGOT_PASSWORD: prefix + 'auth.event.forgot-password'
    };
}
