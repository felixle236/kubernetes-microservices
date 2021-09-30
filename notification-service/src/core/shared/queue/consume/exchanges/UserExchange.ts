import { ENV } from '@configs/Configuration';

const prefix = ENV + '.';

export class UserExchange {
    static EXCHANGE = prefix + 'user';

    static QUEUES = {
        NOTIFICATION_QUEUE_SEND_USER_ACTIVATION: prefix + 'notification.queue.send-user-activation'
    };

    static KEYS = {
        USER_CMD_SEND_USER_ACTIVATION: prefix + 'user.cmd.send-user-activation',
        USER_CMD_RESEND_USER_ACTIVATION: prefix + 'user.cmd.resend-user-activation'
    };
}
