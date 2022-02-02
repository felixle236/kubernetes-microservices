export enum InjectDb {
    DbContext = 'db.context',
    RedisContext = 'redis.context'
}

export enum InjectQueue {
    RabbitMQContext = 'rabbitmq.context'
}

export enum InjectRepository {
    Notification = 'notification.repository',
    NotificationUnreadStatus = 'notification_unread_status.repository',
    User = 'user.repository'
}

export enum InjectService {
    Auth = 'authentication.service',
    Log = 'log.service',
    Mail = 'mail.service',
    Notification = 'notification.service',
    SMS = 'sms.service',
    RabbitMQService = 'rabbitmq.service'
}
