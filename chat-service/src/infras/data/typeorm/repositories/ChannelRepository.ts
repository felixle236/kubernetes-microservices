import { Channel } from 'domain/entities/Channel';
import { IChannelRepository } from 'application/interfaces/repositories/IChannelRepository';
import { SelectFilterPaginationQuery, SortType } from 'shared/database/DbTypes';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Brackets } from 'typeorm';
import { Repository } from '../common/Repository';
import { ChannelDb } from '../entities/ChannelDb';
import { ChannelUserDb } from '../entities/ChannelUserDb';
import { CHANNEL_SCHEMA } from '../schemas/ChannelSchema';
import { CHANNEL_USER_SCHEMA } from '../schemas/ChannelUserSchema';
import { USER_SCHEMA } from '../schemas/UserSchema';

@Service(InjectRepository.Channel)
export class ChannelRepository extends Repository<Channel, ChannelDb> implements IChannelRepository {
    constructor() {
        super(ChannelDb, CHANNEL_SCHEMA);
    }

    override async findAndCount(filter: { userId: string, keyword?: string } & SelectFilterPaginationQuery<Channel>): Promise<[Channel[], number]> {
        const subQuery = this.repository.manager.createQueryBuilder(ChannelUserDb, CHANNEL_USER_SCHEMA.TABLE_NAME)
            .select(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`);

        const query = this.repository.createQueryBuilder(CHANNEL_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${CHANNEL_SCHEMA.TABLE_NAME}.${CHANNEL_SCHEMA.RELATED_MANY.CHANNEL_USERS}`, CHANNEL_USER_SCHEMA.TABLE_NAME, `${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} != :userId`)
            .innerJoinAndSelect(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.RELATED_ONE.USER}`, USER_SCHEMA.TABLE_NAME)
            .where(`${CHANNEL_SCHEMA.TABLE_NAME}.${CHANNEL_SCHEMA.COLUMNS.ID} IN (${subQuery.getQuery()})`);

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query.andWhere(new Brackets(qb => {
                qb.where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query.setParameter('userId', filter.userId);
        query.orderBy(`${CHANNEL_SCHEMA.TABLE_NAME}.updatedAt`, SortType.Desc);
        query.skip(filter.skip);
        query.take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }
}
