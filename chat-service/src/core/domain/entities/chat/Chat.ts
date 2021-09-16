import { IChat } from '@domain/interfaces/chat/IChat';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { ChatChannel } from './ChatChannel';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

export class Chat extends BaseEntity<string, IChat> implements IChat {
    get channelId(): string {
        return this.data.channelId;
    }

    set channelId(val: string) {
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'channel');

        this.data.channelId = val;
    }

    get senderId(): string {
        return this.data.senderId;
    }

    set senderId(val: string) {
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'sender');

        this.data.senderId = val;
    }

    get receiverId(): string {
        return this.data.receiverId;
    }

    set receiverId(val: string) {
        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'receiver');

        this.data.receiverId = val;
    }

    get content(): string {
        return this.data.content;
    }

    set content(val: string) {
        val = val.trim();
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'content');

        if (val.length > 500)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'content', 500);

        this.data.content = val;
    }

    /* Relationship */

    get channel(): ChatChannel | null {
        return this.data.channel ? new ChatChannel(this.data.channel) : null;
    }

    get sender(): User | null {
        return this.data.sender ? new User(this.data.sender) : null;
    }

    get receiver(): User | null {
        return this.data.receiver ? new User(this.data.receiver) : null;
    }
}
