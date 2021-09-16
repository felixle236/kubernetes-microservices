import { Chat } from '@domain/entities/chat/Chat';
import { FindChatByChannelFilter, IChatRepository } from '@gateways/repositories/chat/IChatRepository';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { ChatDb } from '../../entities/chat/ChatDb';
import { CHAT_SCHEMA } from '../../schemas/chat/ChatSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('chat.repository')
export class ChatRepository extends BaseRepository<string, Chat, ChatDb> implements IChatRepository {
    constructor() {
        super(ChatDb, CHAT_SCHEMA);
    }

    async findByChannel(param: FindChatByChannelFilter): Promise<Chat[]> {
        let query = this.repository.createQueryBuilder(CHAT_SCHEMA.TABLE_NAME)
            .where(`${CHAT_SCHEMA.TABLE_NAME}.${CHAT_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId: param.channelId });

        if (param.skipDate)
            query = query.andWhere(`${CHAT_SCHEMA.TABLE_NAME}.${CHAT_SCHEMA.COLUMNS.CREATED_AT} < :skipDate`, { skipDate: param.skipDate });

        let limit = 10;
        if (param.limit)
            limit = param.limit;

        query = query
            .orderBy(`${CHAT_SCHEMA.TABLE_NAME}.createdAt`, SortType.Desc)
            .take(limit);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }
}
