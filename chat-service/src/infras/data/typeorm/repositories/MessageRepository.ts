import { Message } from 'domain/entities/Message';
import { IMessageRepository } from 'application/interfaces/repositories/IMessageRepository';
import { SortType } from 'shared/database/DbTypes';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Repository } from '../common/Repository';
import { MessageDb } from '../entities/MessageDb';
import { MESSAGE_SCHEMA } from '../schemas/MessageSchema';

@Service(InjectRepository.Message)
export class MessageRepository extends Repository<Message, MessageDb> implements IMessageRepository {
    constructor() {
        super(MessageDb, MESSAGE_SCHEMA);
    }

    async findByChannel(param: { channelId: string, skipDate?: Date, limit?: number, }): Promise<Message[]> {
        const query = this.repository.createQueryBuilder(MESSAGE_SCHEMA.TABLE_NAME)
            .where(`${MESSAGE_SCHEMA.TABLE_NAME}.${MESSAGE_SCHEMA.COLUMNS.CHANNEL_ID} = :channelId`, { channelId: param.channelId });

        if (param.skipDate)
            query.andWhere(`${MESSAGE_SCHEMA.TABLE_NAME}.${MESSAGE_SCHEMA.COLUMNS.CREATED_AT} < :skipDate`, { skipDate: param.skipDate });

        let limit = param.limit;
        if (!limit)
            limit = 10;

        query.orderBy(`${MESSAGE_SCHEMA.TABLE_NAME}.createdAt`, SortType.Desc);
        query.take(limit);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }
}
