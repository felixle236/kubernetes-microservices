import { Notification } from '@domain/entities/notification/Notification';
import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { FindNotificationFilter, INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { SortType } from '@shared/database/SortType';
import { Service } from 'typedi';
import { NotificationDb } from '../../entities/notification/NotificationDb';
import { NOTIFICATION_SCHEMA } from '../../schemas/notification/NotificationSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('notification.repository')
export class NotificationRepository extends BaseRepository<string, Notification, NotificationDb> implements INotificationRepository {
    constructor() {
        super(NotificationDb, NOTIFICATION_SCHEMA);
    }

    async find(param: FindNotificationFilter): Promise<Notification[]> {
        let query = this.repository.createQueryBuilder(NOTIFICATION_SCHEMA.TABLE_NAME)
            .where(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TYPE} = :type`, { type: param.type });

        if (param.skipDate)
            query = query.andWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.CREATED_AT} < :skipDate`, { skipDate: param.skipDate });

        query = query.where(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TARGET} = :target`, { target: NotificationTarget.Individual })
            .andWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.RECEIVER_ID} = :receiverId`, { receiverId: param.receiverId });

        query = query
            .orderBy(`${NOTIFICATION_SCHEMA.TABLE_NAME}.createdAt`, SortType.Desc)
            .take(param.limit);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }

    async updateReadByIds(ids: string[], receiverId: string): Promise<boolean> {
        const query = this.repository.createQueryBuilder(NOTIFICATION_SCHEMA.TABLE_NAME)
            .update()
            .set({ isRead: true })
            .whereInIds([...ids])
            .andWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.RECEIVER_ID} = :receiverId`, { receiverId });

        const result = await query.execute();
        return !!result;
    }
}
