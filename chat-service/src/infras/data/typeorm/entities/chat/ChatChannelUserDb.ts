import { ChatChannelUser } from '@domain/entities/chat/ChatChannelUser';
import { ChatChannelUserStatus } from '@domain/enums/chat/ChatChannelUserStatus';
import { IChatChannel } from '@domain/interfaces/chat/IChatChannel';
import { IChatChannelUser } from '@domain/interfaces/chat/IChatChannelUser';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ChatChannelDb } from './ChatChannelDb';
import { CHAT_CHANNEL_USER_SCHEMA } from '../../schemas/chat/ChatChannelUserSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(CHAT_CHANNEL_USER_SCHEMA.TABLE_NAME)
@Index((chatChannelUserDb: ChatChannelUserDb) => [chatChannelUserDb.userId, chatChannelUserDb.updatedAt])
export class ChatChannelUserDb extends BaseDbEntity<string, ChatChannelUser> implements IChatChannelUser {
    @Column('uuid', { name: CHAT_CHANNEL_USER_SCHEMA.COLUMNS.USER_ID })
    userId: string;

    @Column('uuid', { name: CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID })
    channelId: string;

    @Column('enum', { name: CHAT_CHANNEL_USER_SCHEMA.COLUMNS.STATUS, enum: ChatChannelUserStatus, default: ChatChannelUserStatus.Actived })
    status: ChatChannelUserStatus;

    /* Relationship */

    user: IUser | null;

    @ManyToOne(() => ChatChannelDb, channel => channel.channelUsers)
    @JoinColumn({ name: CHAT_CHANNEL_USER_SCHEMA.COLUMNS.CHANNEL_ID })
    channel: IChatChannel | null;

    /* Handlers */

    toEntity(): ChatChannelUser {
        return new ChatChannelUser(this);
    }

    fromEntity(entity: ChatChannelUser): IChatChannelUser {
        return entity.toData();
    }
}
