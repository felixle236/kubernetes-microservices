import { ChatChannelUser } from '@domain/entities/chat/ChatChannelUser';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';

export interface IChatChannelUserRepository extends IBaseRepository<string, ChatChannelUser> {
    getAllByUser(userId: string): Promise<ChatChannelUser[]>;

    getChannelIdByUsers(userId: string, userId2: string): Promise<string | null>;

    getByChannelAndUser(channelId: string, userId: string): Promise<ChatChannelUser | null>;

    checkChannelAndUsers(channelId: string, ...userIds: string[]): Promise<boolean>;

    updateTimeByChannel(channelId: string, updatedAt: Date, queryRunner?: IDbQueryRunner): Promise<boolean>;
}
