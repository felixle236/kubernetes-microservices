import { User } from './User';
import { Entity } from '../common/Entity';

export class NotificationUnreadStatus extends Entity {
    userId: string;
    notificationIds: string[];

    /* Relationship */

    user?: User;

    /* Handlers */
}
