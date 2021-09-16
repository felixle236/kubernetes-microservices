import { ChatChannelUserStatus } from '@domain/enums/chat/ChatChannelUserStatus';
import { IChatChannelUser } from '@domain/interfaces/chat/IChatChannelUser';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { ChatChannel } from './ChatChannel';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

export class ChatChannelUser extends BaseEntity<string, IChatChannelUser> implements IChatChannelUser {
    get userId(): string {
        return this.data.userId;
    }

    set userId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'user');

        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'user');

        this.data.userId = val;
    }

    get channelId(): string {
        return this.data.channelId;
    }

    set channelId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'channel');

        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'channel');

        this.data.channelId = val;
    }

    get status(): ChatChannelUserStatus {
        return this.data.status;
    }

    set status(val: ChatChannelUserStatus) {
        this.data.status = val;
    }

    /* Relationship */

    get user(): User | null {
        return this.data.user ? new User(this.data.user) : null;
    }

    get channel(): ChatChannel | null {
        return this.data.channel ? new ChatChannel(this.data.channel) : null;
    }
}
