import { Message } from 'domain/entities/Message';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IMessageRepository extends IRepository<Message> {
    findByChannel(param: { channelId: string, skipDate?: Date, limit: number }): Promise<Message[]>;
}
