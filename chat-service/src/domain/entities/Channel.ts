import { ChannelUser } from './ChannelUser';
import { Message } from './Message';
import { User } from './User';
import { Entity } from '../common/Entity';

export class Channel extends Entity {
    lastMessage?: string;
    lastSenderId?: string;

    /* Relationship */

    lastSender?: User;
    channelUsers?: ChannelUser[];
    messages?: Message[];

    /* Handlers */
}
