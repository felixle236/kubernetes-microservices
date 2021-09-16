import { IChatChannel } from '@domain/interfaces/chat/IChatChannel';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { Chat } from './Chat';
import { ChatChannelUser } from './ChatChannelUser';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

export class ChatChannel extends BaseEntity<string, IChatChannel> implements IChatChannel {
    get lastMessage(): string | null {
        return this.data.lastMessage;
    }

    set lastMessage(val: string | null) {
        if (val) {
            if (val.length > 500)
                throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last message', 500);
        }
        this.data.lastMessage = val;
    }

    get lastSenderId(): string | null {
        return this.data.lastSenderId;
    }

    set lastSenderId(val: string | null) {
        if (!val) {
            if (!validator.isUUID(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'last sender');
        }
        this.data.lastSenderId = val;
    }

    /* Relationship */

    get lastSender(): User | null {
        return this.data.lastSender ? new User(this.data.lastSender) : null;
    }

    get channelUsers(): ChatChannelUser[] | null {
        return this.data.channelUsers ? this.data.channelUsers.map(channelUser => new ChatChannelUser(channelUser)) : null;
    }

    get chats(): Chat[] | null {
        return this.data.chats ? this.data.chats.map(chat => new Chat(chat)) : null;
    }
}
