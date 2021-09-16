import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { IEntity } from '../base/IEntity';

export interface INotification extends IEntity<string> {
    type: NotificationType;
    target: NotificationTarget;
    receiverId: string | null;
    isRead: boolean;
    title: string | null;
    content: string;
    contentHtml: string;
}
