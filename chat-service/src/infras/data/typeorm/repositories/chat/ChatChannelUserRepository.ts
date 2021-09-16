import { ChatChannelUser } from '@domain/entities/chat/ChatChannelUser';
import { IChatChannelUserRepository } from '@gateways/repositories/chat/IChatChannelUserRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { Brackets, QueryRunner } from 'typeorm';
import { ChatChannelUserDb } from '../../entities/chat/ChatChannelUserDb';
import { UserDb } from '../../entities/user/UserDb';
import { CHAT_CHANNEL_SCHEMA } from '../../schemas/chat/ChatChannelSchema';
import { CHAT_CHANNEL_USER_SCHEMA } from '../../schemas/chat/ChatChannelUserSchema';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('chat_channel_user.repository')
export class ChatChannelUserRepository extends BaseRepository<string, ChatChannelUser, ChatChannelUserDb> implements IChatChannelUserRepository {
    constructor() {
        super(ChatChannelUserDb, CHAT_CHANNEL_USER_SCHEMA);
    }

    async getAllByUser(userId: string): Promise<ChatChannelUser[]> {
        const query = this.repository.createQueryBuilder(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME)
            .leftJoinAndSelect(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.RELATED_ONE.CHANNEL}`, CHAT_CHANNEL_SCHEMA.TABLE_NAME, `${CHAT_CHANNEL_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_SCHEMA.COLUMNS.ID} = ${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .leftJoinAndMapOne(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.RELATED_ONE.USER}`, UserDb, USER_SCHEMA.TABLE_NAME, `${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ID} = ${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID}`)
            .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} != :notUserId`, { notUserId: userId })
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}_2.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
                    .from(ChatChannelUserDb, `${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}_2`)
                    .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}_2.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId })
                    .getQuery();
                return `${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} IN ` + subQuery;
            })
            .orderBy(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.updatedAt`, SortType.Desc);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }

    async getChannelIdByUsers(userId: string, userId2: string): Promise<string | null> {
        const subQuery = this.repository.createQueryBuilder(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME)
            .select(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId2`);

        const query = this.repository.createQueryBuilder(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME)
            .innerJoin('(' + subQuery.getQuery() + ')', `${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}_2`, `${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}_2.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = ${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID}`)
            .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId, userId2 });

        const result = await query.getOne();
        return result ? result.channelId : null;
    }

    async getByChannelAndUser(channelId: string, userId: string): Promise<ChatChannelUser | null> {
        const query = this.repository.createQueryBuilder(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME)
            .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId })
            .andWhere(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }

    async checkChannelAndUsers(channelId: string, ...userIds: string[]): Promise<boolean> {
        const query = this.repository.createQueryBuilder(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME)
            .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId })
            .andWhere(new Brackets(qb => {
                for (let i = 0; i < userIds.length; i++) {
                    const userId = userIds[i];
                    const param = {};
                    param['userId' + i] = userId;
                    qb.orWhere(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID} = :userId${i}`, param);
                }
            }));

        const count = await query.getCount();
        return count > 0 && count === userIds.length;
    }

    async updateTimeByChannel(channelId: string, updatedAt: Date, queryRunner?: IDbQueryRunner): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .update({ updatedAt })
            .where(`${CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME}.${CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId })
            .execute();
        return !!result.affected;
    }
}
