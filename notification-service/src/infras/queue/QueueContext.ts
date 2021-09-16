import { RABBITMQ_HOST, RABBITMQ_PASS, RABBITMQ_USER } from '@configs/Configuration';
import { ILogService } from '@gateways/services/ILogService';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { IRoutingQueue } from '@shared/queue/interfaces/IRoutingQueue';
import { TraceRequest } from '@shared/request/TraceRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { Channel, connect, Connection, ConsumeMessage, credentials, Options, Replies } from 'amqplib';
import { isBoolean } from 'class-validator';
import { CloudEvent } from 'cloudevents';
import { Inject, Service } from 'typedi';

@Service('queue.context')
export class QueueContext implements IQueueContext {
    private _connection: Connection;
    private _channel: Channel;

    @Inject('log.service')
    private readonly _logService: ILogService;

    async getConnection(): Promise<Connection> {
        if (this._connection)
            return this._connection;

        return await this.createConnection();
    }

    async createConnection(): Promise<Connection> {
        if (this._connection)
            return this._connection;

        this._connection = await connect('amqp://' + RABBITMQ_HOST, { credentials: credentials.plain(RABBITMQ_USER, RABBITMQ_PASS) });
        this._channel = await this._connection.createChannel();
        return this._connection;
    }

    async createExchange(exchange: string, type = 'topic', options?: Options.AssertExchange): Promise<Replies.AssertExchange> {
        if (!options)
            options = {};
        if (!isBoolean(options.durable))
            options.durable = true;

        return await this._channel.assertExchange(exchange, type, options);
    }

    async createQueue(queue: string, options?: Options.AssertQueue): Promise<Replies.AssertQueue> {
        if (!options)
            options = {};
        if (!isBoolean(options.durable))
            options.durable = true;

        return await this._channel.assertQueue(queue, options);
    }

    async consumeQueues(exchange: string, queues: string[], type?: string, exchangeOptions?: Options.AssertExchange, queueOptions?: Options.AssertQueue): Promise<void> {
        await this.createExchange(exchange, type, exchangeOptions);

        for (let i = 0; i < queues.length; i++) {
            const queue = queues[i];
            await this.createQueue(queue, queueOptions);
        }
    }

    async provideQueues(exchange: string, routings: IRoutingQueue[], type?: string, exchangeOptions?: Options.AssertExchange, queueOptions?: Options.AssertQueue): Promise<void> {
        const deadLetterExchange = 'dlx';
        await this.createExchange(exchange, type, exchangeOptions);
        await this.createExchange(deadLetterExchange);

        // NOTE: Need to add policy manually to apply dead-letter-exchange with Web UI or command below:
        // CMD: rabbitmqctl set_policy DLX '^((?!\.dlq).)*$' '{"dead-letter-exchange":"dlx"}' --apply-to queues

        for (let i = 0; i < routings.length; i++) {
            const routing = routings[i];
            const deadLetterQueue = routing.queue + '.dlq';

            await this.createQueue(routing.queue, queueOptions);
            await this.createQueue(deadLetterQueue);

            for (let j = 0; j < routing.keys.length; j++) {
                const key = routing.keys[j];
                await this._channel.bindQueue(routing.queue, exchange, key);
                await this._channel.bindQueue(deadLetterQueue, deadLetterExchange, key);
            }
        }
    }

    publish<T>(exchange: string, key: string, payload: T, options?: Options.Publish, handleOption?: HandleOption): boolean {
        const ce = new CloudEvent({
            source: exchange,
            type: key,
            data: payload
        });
        this._logService.info('Channel publish:', ce, handleOption?.trace?.id ?? '');

        if (handleOption) {
            if (!options)
                options = {};
            if (!options.headers)
                options.headers = {};
            handleOption.trace.setToMQHeader(options.headers);
        }

        return this._channel.publish(exchange, key, Buffer.from(ce.toString()), options);
    }

    async consume<T>(queue: string, onMessage: (channel: Channel, key: string, msg: ConsumeMessage, payload: T, handleOption: HandleOption) => Promise<void>, options?: Options.Consume): Promise<Replies.Consume> {
        if (!options)
            options = {};
        options.noAck = false;

        return await this._channel.consume(queue, async msg => {
            if (msg) {
                const trace = new TraceRequest();
                trace.getFromMQHeader(msg.properties.headers);
                try {
                    const ce = new CloudEvent(JSON.parse(msg.content.toString()));
                    this._logService.info('Channel consume:', ce, trace.id);

                    const handleOption = new HandleOption();
                    handleOption.trace = trace;

                    await onMessage(this._channel, ce.type, msg, ce.data as T, handleOption);
                    this._channel.ack(msg);
                }
                catch (error) {
                    this._logService.error('Channel consume:', error, trace.id);
                    this._channel.reject(msg, false);
                }
            }
        }, options);
    }
}
