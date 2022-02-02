import { Channel } from './Channel';
import { User } from './User';
import { Entity } from '../common/Entity';

export class ChannelUser extends Entity {
    userId: string;
    channelId: string;

    /* Relationship */

    user?: User;
    channel?: Channel;

    /* Handlers */
}
