import { ChannelUser } from 'domain/entities/ChannelUser';
import { IChannelUserRepository } from 'application/interfaces/repositories/IChannelUserRepository';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Repository } from '../common/Repository';
import { ChannelUserDb } from '../entities/ChannelUserDb';
import { CHANNEL_USER_SCHEMA } from '../schemas/ChannelUserSchema';

@Service(InjectRepository.ChannelUser)
export class ChannelUserRepository extends Repository<ChannelUser, ChannelUserDb> implements IChannelUserRepository {
    constructor() {
        super(ChannelUserDb, CHANNEL_USER_SCHEMA);
    }

    async findByChannel(channelId: string): Promise<ChannelUser[]> {
        const query = this.repository.createQueryBuilder(CHANNEL_USER_SCHEMA.TABLE_NAME)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId });

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }

    async getChannelIdByUsers(userId: string, userId2: string): Promise<string | undefined> {
        const subQuery = this.repository.createQueryBuilder(CHANNEL_USER_SCHEMA.TABLE_NAME)
            .select(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId2`);

        const query = this.repository.createQueryBuilder(CHANNEL_USER_SCHEMA.TABLE_NAME)
            .innerJoin('(' + subQuery.getQuery() + ')', `${CHANNEL_USER_SCHEMA.TABLE_NAME}_2`, `${CHANNEL_USER_SCHEMA.TABLE_NAME}_2.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = ${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`);

        query.setParameters({ userId, userId2 });
        const result = await query.getOne();
        return result && result.channelId;
    }

    async getByChannelAndUser(channelId: string, userId: string): Promise<ChannelUser | undefined> {
        const query = this.repository.createQueryBuilder(CHANNEL_USER_SCHEMA.TABLE_NAME)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId })
            .andWhere(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId });

        const result = await query.getOne();
        return result && result.toEntity();
    }

    async checkChannelAndUsers(channelId: string, userId: string, userId2: string): Promise<boolean> {
        const subQuery = this.repository.createQueryBuilder(CHANNEL_USER_SCHEMA.TABLE_NAME)
            .select(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId2`)
            .andWhere(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`);

        const query = this.repository.createQueryBuilder(CHANNEL_USER_SCHEMA.TABLE_NAME)
            .innerJoin('(' + subQuery.getQuery() + ')', `${CHANNEL_USER_SCHEMA.TABLE_NAME}_2`, `${CHANNEL_USER_SCHEMA.TABLE_NAME}_2.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = ${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`)
            .andWhere(`${CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`);

        query.setParameters({ channelId, userId, userId2 });
        const count = await query.getCount();
        return !!count;
    }
}
