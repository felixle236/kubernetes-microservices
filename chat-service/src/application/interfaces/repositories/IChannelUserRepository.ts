import { ChannelUser } from 'domain/entities/ChannelUser';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IChannelUserRepository extends IRepository<ChannelUser> {
    findByChannel(channelId: string): Promise<ChannelUser[]>;

    getChannelIdByUsers(userId: string, userId2: string): Promise<string | undefined>;

    getByChannelAndUser(channelId: string, userId: string): Promise<ChannelUser | undefined>;

    checkChannelAndUsers(channelId: string, ...userIds: string[]): Promise<boolean>;
}
