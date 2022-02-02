export enum InjectDb {
    DbContext = 'db.context',
    RedisContext = 'redis.context'
}

export enum InjectQueue {
    RabbitMQContext = 'rabbitmq.context',
}

export enum InjectRepository {
    User = 'user.repository',
    Auth = 'auth.repository',
}

export enum InjectService {
    AuthJwt = 'auth_jwt.service',
    Log = 'log.service',
    RabbitMQService = 'rabbitmq.service',
}
