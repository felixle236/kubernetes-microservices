import { Channel } from 'domain/entities/Channel';
import { SelectFilterPaginationQuery } from 'shared/database/DbTypes';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IChannelRepository extends IRepository<Channel> {
    findAndCount(filter: { userId: string, keyword?: string } & SelectFilterPaginationQuery<Channel>): Promise<[Channel[], number]>;
}
