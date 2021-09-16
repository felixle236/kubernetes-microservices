import { HandleOption } from '@shared/usecase/HandleOption';
import { Channel, Connection, ConsumeMessage, Options, Replies } from 'amqplib';
import { IRoutingQueue } from './IRoutingQueue';

export interface IQueueContext {
    getConnection(): Promise<Connection>;

    createConnection(): Promise<Connection>;

    createExchange(exchange: string, type?: string, options?: Options.AssertExchange): Promise<Replies.AssertExchange>;

    createQueue(queue: string, options?: Options.AssertQueue): Promise<Replies.AssertQueue>;

    consumeQueues(exchange: string, queues: string[]): Promise<void>;
    consumeQueues(exchange: string, queues: string[], type: string): Promise<void>;
    consumeQueues(exchange: string, queues: string[], type: string, options: Options.AssertExchange): Promise<void>;

    provideQueues(exchange: string, routings: IRoutingQueue[]): Promise<void>;
    provideQueues(exchange: string, routings: IRoutingQueue[], type: string): Promise<void>;
    provideQueues(exchange: string, routings: IRoutingQueue[], type: string, options: Options.AssertExchange): Promise<void>;

    publish<T>(exchange: string, routing: string, payload: T): boolean;
    publish<T>(exchange: string, routing: string, payload: T, options: Options.Publish): boolean;
    publish<T>(exchange: string, routing: string, payload: T, options: Options.Publish, handleOption: HandleOption): boolean;

    consume<T>(queue: string, onMessage: (channel: Channel, key: string, msg: ConsumeMessage, payload: T, handleOption: HandleOption) => Promise<void>): Promise<Replies.Consume>;
    consume<T>(queue: string, onMessage: (channel: Channel, key: string, msg: ConsumeMessage, payload: T, handleOption: HandleOption) => Promise<void>, options: Options.Consume): Promise<Replies.Consume>;
}
