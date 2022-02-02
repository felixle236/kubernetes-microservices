import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { NotificationType } from 'domain/enums/NotificationType';
import { User } from './User';
import { Entity } from '../common/Entity';

export class Notification extends Entity {
    type: NotificationType;
    template: NotificationTemplate;
    target: NotificationTarget;
    receiverId?: string;
    title: string;
    content: string;
    contentSpec: string;

    /* Relationship */

    receiver?: User;

    /* Handlers */
}
