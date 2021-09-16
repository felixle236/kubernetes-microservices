import { ChatChannelUserStatus } from '@domain/enums/chat/ChatChannelUserStatus';
import { IChatChannel } from './IChatChannel';
import { IEntity } from '../base/IEntity';
import { IUser } from '../user/IUser';

export interface IChatChannelUser extends IEntity<string> {
    id: string;
    userId: string;
    channelId: string;
    status: ChatChannelUserStatus;

    /* Relationship */

    user: IUser | null;
    channel: IChatChannel | null;
}
