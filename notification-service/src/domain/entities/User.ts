import { Entity } from 'domain/common/Entity';
import { UserStatus } from 'domain/enums/UserStatus';
import { UserDevice } from 'domain/value-objects/UserDevice';
import { Notification } from './Notification';
import { NotificationUnreadStatus } from './NotificationUnreadStatus';

export class User extends Entity {
    roleId: string;
    firstName: string;
    lastName?: string;
    email: string;
    status: UserStatus;
    devices?: UserDevice[];

    /* Relationship */

    notifications?: Notification[];
    notificationUnreadStatus?: NotificationUnreadStatus;

    /* Handlers */
}
