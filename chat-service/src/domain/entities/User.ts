import { Entity } from 'domain/common/Entity';
import { UserStatus } from 'domain/enums/UserStatus';
import { Channel } from './Channel';
import { ChannelUser } from './ChannelUser';
import { Message } from './Message';

export class User extends Entity {
    roleId: string;
    firstName: string;
    lastName?: string;
    email: string;
    status: UserStatus;
    avatar?: string;

    /* Relationship */

    channels?: Channel[];
    channelUsers?: ChannelUser[];
    sendMessages?: Message[];
    receiveMessages?: Message[];

    /* Handlers */
}
