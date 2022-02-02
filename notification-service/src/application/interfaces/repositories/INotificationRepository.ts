import { Notification } from 'domain/entities/Notification';
import { NotificationType } from 'domain/enums/NotificationType';
import { SelectFilterListQuery } from 'shared/database/DbTypes';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface INotificationRepository extends IRepository<Notification> {
    findNotification(filter: { roleId: string, receiverId: string, type?: NotificationType, skipDate?: Date, limit?: number } & SelectFilterListQuery<Notification>): Promise<Notification[]>;
}
