import { ChatChannel } from '@domain/entities/chat/ChatChannel';
import { IChat } from '@domain/interfaces/chat/IChat';
import { IChatChannel } from '@domain/interfaces/chat/IChatChannel';
import { IChatChannelUser } from '@domain/interfaces/chat/IChatChannelUser';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatChannelUserDb } from './ChatChannelUserDb';
import { ChatDb } from './ChatDb';
import { CHAT_CHANNEL_SCHEMA } from '../../schemas/chat/ChatChannelSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(CHAT_CHANNEL_SCHEMA.TABLE_NAME)
export class ChatChannelDb extends BaseDbEntity<string, ChatChannel> implements IChatChannel {
    @Column('varchar', { name: CHAT_CHANNEL_SCHEMA.COLUMNS.LAST_MESSAGE, length: 500, nullable: true })
    lastMessage: string | null;

    @Column('uuid', { name: CHAT_CHANNEL_SCHEMA.COLUMNS.LAST_SENDER_ID, nullable: true })
    lastSenderId: string | null;

    /* Relationship */

    lastSender: IUser | null;

    @OneToMany(() => ChatChannelUserDb, channelUser => channelUser.channel)
    channelUsers: IChatChannelUser[] | null;

    @OneToMany(() => ChatDb, chat => chat.channel)
    chats: IChat[] | null;

    /* Handlers */

    toEntity(): ChatChannel {
        return new ChatChannel(this);
    }

    fromEntity(entity: ChatChannel): IChatChannel {
        return entity.toData();
    }
}
