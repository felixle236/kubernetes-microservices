import { Chat } from '@domain/entities/chat/Chat';
import { IChat } from '@domain/interfaces/chat/IChat';
import { IChatChannel } from '@domain/interfaces/chat/IChatChannel';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ChatChannelDb } from './ChatChannelDb';
import { CHAT_SCHEMA } from '../../schemas/chat/ChatSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(CHAT_SCHEMA.TABLE_NAME)
@Index((chatDb: ChatDb) => [chatDb.channelId, chatDb.createdAt])
export class ChatDb extends BaseDbEntity<string, Chat> implements IChat {
    @Column('uuid', { name: CHAT_SCHEMA.COLUMNS.CHANNEL_ID })
    channelId: string;

    @Column('uuid', { name: CHAT_SCHEMA.COLUMNS.SENDER_ID })
    senderId: string;

    @Column('uuid', { name: CHAT_SCHEMA.COLUMNS.RECEIVER_ID })
    @Index()
    receiverId: string;

    @Column('varchar', { name: CHAT_SCHEMA.COLUMNS.CONTENT, length: 500 })
    content: string;

    /* Relationship */

    @ManyToOne(() => ChatChannelDb, channel => channel.channelUsers)
    @JoinColumn({ name: CHAT_SCHEMA.COLUMNS.CHANNEL_ID })
    channel: IChatChannel | null;

    sender: IUser | null;
    receiver: IUser | null;

    /* Handlers */

    toEntity(): Chat {
        return new Chat(this);
    }

    fromEntity(entity: Chat): IChat {
        return entity.toData();
    }
}
