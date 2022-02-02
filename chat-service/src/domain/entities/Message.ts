import { Channel } from './Channel';
import { User } from './User';
import { Entity } from '../common/Entity';

export class Message extends Entity {
    channelId: string;
    senderId: string;
    receiverId: string;
    content: string;

    /* Relationship */

    channel?: Channel;
    sender?: User;
    receiver?: User;

    /* Handlers */
}
