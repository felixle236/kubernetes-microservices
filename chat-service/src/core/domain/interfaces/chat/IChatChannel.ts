import { IChat } from './IChat';
import { IChatChannelUser } from './IChatChannelUser';
import { IEntity } from '../base/IEntity';
import { IUser } from '../user/IUser';

export interface IChatChannel extends IEntity<string> {
    id: string;
    lastMessage: string | null;
    lastSenderId: string | null;

    /* Relationship */

    lastSender: IUser | null;
    channelUsers: IChatChannelUser[] | null;
    chats: IChat[] | null;
}
