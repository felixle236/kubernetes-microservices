export enum InjectDb {
    DbContext = 'db.context',
    RedisContext = 'redis.context'
}

export enum InjectQueue {
    RabbitMQContext = 'rabbitmq.context',
}

export enum InjectRepository {
    User = 'user.repository',
    Client = 'client.repository',
    Manager = 'manager.repository',
    Auth = 'auth.repository',
}

export enum InjectService {
    Auth = 'authentication.service',
    Log = 'log.service',
    RabbitMQService = 'rabbitmq.service',
    Storage = 'storage.service'
}
