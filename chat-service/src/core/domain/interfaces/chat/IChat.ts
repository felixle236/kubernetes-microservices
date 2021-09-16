import { IChatChannel } from './IChatChannel';
import { IEntity } from '../base/IEntity';
import { IUser } from '../user/IUser';

export interface IChat extends IEntity<string> {
    id: string;
    channelId: string;
    senderId: string;
    receiverId: string;
    content: string;

    /* Relationship */

    channel: IChatChannel | null;
    sender: IUser | null;
    receiver: IUser | null;
}
