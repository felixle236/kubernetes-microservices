import { Notification } from '@domain/entities/notification/Notification';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindNotificationFilter {
    type: NotificationType;
    receiverId: string;
    skipDate: Date | null;
    limit = 10;
}

export interface INotificationRepository extends IBaseRepository<string, Notification> {
    find(param: FindNotificationFilter): Promise<Notification[]>;

    updateReadByIds(ids: string[], receiverId: string): Promise<boolean>;
}
