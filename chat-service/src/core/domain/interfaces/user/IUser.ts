import { UserStatus } from '@domain/enums/user/UserStatus';
import { IEntity } from '../base/IEntity';
import { IChat } from '../chat/IChat';
import { IChatChannelUser } from '../chat/IChatChannelUser';

export interface IUser extends IEntity<string> {
    roleId: string;
    status: UserStatus;
    firstName: string;
    lastName: string | null;
    email: string;
    avatar: string | null;

    /* Relationship */

    chatChannelUsers: IChatChannelUser[] | null;
    chatSenders: IChat[] | null;
    chatReceivers: IChat[] | null;
}
