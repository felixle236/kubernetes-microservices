export class UserExchange {
    static EXCHANGE = 'user';

    static QUEUES = {
        NOTIFICATION_QUEUE_SEND_USER_ACTIVATION: 'notification.queue.send-user-activation'
    };

    static KEYS = {
        USER_CMD_SEND_USER_ACTIVATION: 'user.cmd.send-user-activation',
        USER_CMD_RESEND_USER_ACTIVATION: 'user.cmd.resend-user-activation'
    };
}
