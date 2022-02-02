import { NotificationUnreadStatus } from 'domain/entities/NotificationUnreadStatus';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface INotificationUnreadStatusRepository extends IRepository<NotificationUnreadStatus> {
    findUnreadStatuses(filter: { userId: string, notificationIds: string[]}): Promise<string[]>;

    countUnreadStatus(filter: { userId: string }): Promise<number>;

    getByUser(userId: string): Promise<NotificationUnreadStatus | undefined>;
}
