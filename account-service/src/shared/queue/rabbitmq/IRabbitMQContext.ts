import { Channel, Connection, ConsumeMessage, Options, Replies } from 'amqplib';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { RoutingQueue } from './RoutingQueue';

export interface IRabbitMQContext {
    createConnection(): Promise<Connection>;

    createChannel(): Promise<Channel>;

    createExchange(exchange: string): Promise<Replies.AssertExchange>;
    createExchange(exchange: string, type: string | undefined): Promise<Replies.AssertExchange>;
    createExchange(exchange: string, type: string | undefined, options: Options.AssertExchange | undefined): Promise<Replies.AssertExchange>;

    createQueue(queue: string): Promise<Replies.AssertQueue>;
    createQueue(queue: string, options: Options.AssertQueue): Promise<Replies.AssertQueue>;

    initConsumerQueues(queues: { [key: string]: string }): Promise<void>;
    initConsumerQueues(queues: { [key: string]: string }, queueOptions: Options.AssertQueue): Promise<void>;

    initProviderQueues(routes: { [route: string]: RoutingQueue }): Promise<void>;
    initProviderQueues(routes: { [route: string]: RoutingQueue }, type: string | undefined): Promise<void>;
    initProviderQueues(routes: { [route: string]: RoutingQueue }, type: string | undefined, queueOptions: Options.AssertQueue | undefined): Promise<void>;

    publish<T>(routing: string, payload: T, usecaseOption: UsecaseOption): boolean;
    publish<T>(routing: string, payload: T, usecaseOption: UsecaseOption, options: Options.Publish | undefined): boolean;

    consume<T>(queue: string, onMessage: (channel: Channel, key: string, msg: ConsumeMessage, payload: T, usecaseOption: UsecaseOption) => Promise<void>): Promise<Replies.Consume>;
    consume<T>(queue: string, onMessage: (channel: Channel, key: string, msg: ConsumeMessage, payload: T, usecaseOption: UsecaseOption) => Promise<void>, options: Options.Consume | undefined): Promise<Replies.Consume>;
}
