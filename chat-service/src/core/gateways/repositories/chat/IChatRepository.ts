import { Chat } from '@domain/entities/chat/Chat';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindChatByChannelFilter {
    channelId: string;
    skipDate: Date | null;
    limit: number;
}

export interface IChatRepository extends IBaseRepository<string, Chat> {
    findByChannel(param: FindChatByChannelFilter): Promise<Chat[]>;
}
