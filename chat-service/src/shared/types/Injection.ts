export enum InjectDb {
    DbContext = 'db.context',
    RedisContext = 'redis.context'
}

export enum InjectQueue {
    RabbitMQContext = 'rabbitmq.context'
}

export enum InjectRepository {
    UserOnlineStatus = 'user_online_status.repository',
    User = 'user.repository',
    Channel = 'channel.repository',
    ChannelUser = 'channel_user.repository',
    Message = 'message.repository'
}

export enum InjectService {
    Auth = 'authentication.service',
    Log = 'log.service',
    RabbitMQService = 'rabbitmq.service',
    SocketEmitter = 'socket_emitter.service'
}
