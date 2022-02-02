import { AuthType } from 'domain/enums/AuthType';
import { Channel, connect, Connection, ConsumeMessage, credentials, Options, Replies } from 'amqplib';
import { ILogService } from 'application/interfaces/services/ILogService';
import { CloudEvent } from 'cloudevents';
import { RABBITMQ_HOST, RABBITMQ_PASS, RABBITMQ_USER, RABBITMQ_PREFIX, RABBITMQ_EXCHANGE } from 'config/Configuration';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { IRabbitMQContext } from 'shared/queue/rabbitmq/IRabbitMQContext';
import { RoutingQueue } from 'shared/queue/rabbitmq/RoutingQueue';
import { TraceRequest } from 'shared/request/TraceRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { QueueHeaderKey } from 'shared/types/Common';
import { InjectQueue, InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';

@Service(InjectQueue.RabbitMQContext)
export class RabbitMQContext implements IRabbitMQContext {
    private _connection: Connection;
    private _channel: Channel;
    private _exchange = `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}`;
    private _deadLetterExchange = `${RABBITMQ_PREFIX}.all.dlx`;

    constructor(
        @Inject(InjectService.Log) private readonly _logService: ILogService
    ) {}

    async createConnection(): Promise<Connection> {
        if (this._connection)
            return this._connection;

        this._connection = await connect('amqp://' + RABBITMQ_HOST, { credentials: credentials.plain(RABBITMQ_USER, RABBITMQ_PASS) });
        return this._connection;
    }

    async createChannel(): Promise<Channel> {
        if (!this._connection)
            throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'rabbitmq_connection' });

        this._channel = await this._connection.createChannel();
        return this._channel;
    }

    async createExchange(exchange: string, type = 'topic', options: Options.AssertExchange = {}): Promise<Replies.AssertExchange> {
        if (options.durable == null)
            options.durable = true;

        return await this._channel.assertExchange(exchange, type, options);
    }

    async createQueue(queue: string, options: Options.AssertQueue = {}): Promise<Replies.AssertQueue> {
        if (options.durable == null)
            options.durable = true;

        return await this._channel.assertQueue(queue, options);
    }

    async initConsumerQueues(queues: { [key: string]: string }, queueOptions: Options.AssertQueue = {}): Promise<void> {
        const keys = Object.keys(queues);
        for (const key of keys) {
            const queue = queues[key];
            const deadLetterQueue = queue + '.dlq';

            queueOptions.deadLetterExchange = this._deadLetterExchange;
            queueOptions.deadLetterRoutingKey = queue;
            await this.createQueue(queue, queueOptions);
            await this.createQueue(deadLetterQueue);
        }
    }

    async initProviderQueues(routes: { [route: string]: RoutingQueue }, type?: string, queueOptions: Options.AssertQueue = {}): Promise<void> {
        await this.createExchange(this._exchange, type);
        await this.createExchange(this._deadLetterExchange);

        const arr = Object.keys(routes);
        for (let i = 0; i < arr.length; i++) {
            const route = routes[arr[i]];

            for (let j = 0; j < route.queues.length; j++) {
                const queue = route.queues[j];
                const deadLetterQueue = queue + '.dlq';

                queueOptions.deadLetterExchange = this._deadLetterExchange;
                queueOptions.deadLetterRoutingKey = queue;
                await this.createQueue(queue, queueOptions);
                await this.createQueue(deadLetterQueue);

                await this._channel.bindQueue(queue, this._exchange, route.key);
                await this._channel.bindQueue(deadLetterQueue, this._deadLetterExchange, queueOptions.deadLetterRoutingKey);
            }
        }
    }

    publish<T>(key: string, payload: T, usecaseOption: UsecaseOption, options: Options.Publish = {}): boolean {
        const ce = new CloudEvent<T>({
            source: this._exchange,
            type: key,
            data: payload
        });

        if (!options.headers)
            options.headers = {};
        usecaseOption.trace.setToMQHeader(options.headers);

        if (usecaseOption.userAuth) {
            options.headers[QueueHeaderKey.UserId] = usecaseOption.userAuth.userId;
            options.headers[QueueHeaderKey.RoleId] = usecaseOption.userAuth.roleId;
            options.headers[QueueHeaderKey.AuthType] = usecaseOption.userAuth.type;
        }

        return this._channel.publish(this._exchange, key, Buffer.from(ce.toString()), options);
    }

    async consume<T>(queue: string, onMessage: (channel: Channel, key: string, msg: ConsumeMessage, payload: T, usecaseOption: UsecaseOption) => Promise<void>, options: Options.Consume = {}): Promise<Replies.Consume> {
        options.noAck = false;

        return await this._channel.consume(queue, async msg => {
            if (msg) {
                const headers = msg.properties.headers;
                const trace = new TraceRequest();
                trace.getFromMQHeader(headers);

                let userAuth: UserAuthenticated | undefined;
                if (headers[QueueHeaderKey.UserId] && headers[QueueHeaderKey.RoleId] && headers[QueueHeaderKey.AuthType])
                    userAuth = new UserAuthenticated(headers[QueueHeaderKey.UserId] as string, headers[QueueHeaderKey.RoleId] as string, headers[QueueHeaderKey.AuthType] as AuthType);

                const usecaseOption = new UsecaseOption();
                usecaseOption.trace = trace;
                usecaseOption.userAuth = userAuth;

                try {
                    const ce = new CloudEvent<T>(JSON.parse(msg.content.toString()));
                    await onMessage(this._channel, ce.type, msg, ce.data as T, usecaseOption);
                    this._channel.ack(msg);
                }
                catch (error) {
                    this._logService.error('Channel consume error:', error, trace);
                    this._logService.error('Channel consume data:', msg.content.toString(), trace);
                    this._channel.reject(msg, false);
                }
            }
        }, options);
    }
}
