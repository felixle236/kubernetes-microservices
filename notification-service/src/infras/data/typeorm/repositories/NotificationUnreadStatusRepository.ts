import { NotificationUnreadStatus } from 'domain/entities/NotificationUnreadStatus';
import { INotificationUnreadStatusRepository } from 'application/interfaces/repositories/INotificationUnreadStatusRepository';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Repository } from '../common/Repository';
import { NotificationUnreadStatusDb } from '../entities/NotificationUnreadStatusDb';
import { NOTIFICATION_UNREAD_STATUS_SCHEMA } from '../schemas/NotificationUnreadStatusSchema';

@Service(InjectRepository.NotificationUnreadStatus)
export class NotificationUnreadStatusRepository extends Repository<NotificationUnreadStatus, NotificationUnreadStatusDb> implements INotificationUnreadStatusRepository {
    constructor() {
        super(NotificationUnreadStatusDb, NOTIFICATION_UNREAD_STATUS_SCHEMA);
    }

    async findUnreadStatuses(filter: { userId: string, notificationIds: string[]}): Promise<string[]> {
        const query = this.repository.createQueryBuilder(NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME)
            .select(`${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.notification_id`, 'notificationId')
            .from(qb => {
                return qb.select(`unnest(${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.${NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.NOTIFICATION_IDS})`, 'notification_id')
                    .from(NotificationUnreadStatusDb, NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME)
                    .where(`${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.${NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId: filter.userId });
            }, NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME)
            .where(`${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.notification_id IN (:...notificationIds)`, { notificationIds: filter.notificationIds });

        const list = await query.getRawMany<{notificationId: string}>();
        return list.map(item => item.notificationId);
    }

    async countUnreadStatus(filter: { userId: string }): Promise<number> {
        const query = this.repository.createQueryBuilder(NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME)
            .select(`array_length(${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.${NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.NOTIFICATION_IDS})`, 'total')
            .where(`${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.${NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId: filter.userId });
        const result = await query.getRawOne<{total: number}>();
        return result ? result.total : 0;
    }

    async getByUser(userId: string): Promise<NotificationUnreadStatus | undefined> {
        const query = this.repository.createQueryBuilder(NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME)
            .where(`${NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME}.${NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId });

        const result = await query.getOne();
        return result && result.toEntity();
    }
}
