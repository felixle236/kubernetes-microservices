import { Notification } from 'domain/entities/Notification';
import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationType } from 'domain/enums/NotificationType';
import { RoleId } from 'domain/enums/RoleId';
import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { SelectFilterListQuery, SortType } from 'shared/database/DbTypes';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Brackets } from 'typeorm';
import { Repository } from '../common/Repository';
import { NotificationDb } from '../entities/NotificationDb';
import { NOTIFICATION_SCHEMA } from '../schemas/NotificationSchema';

@Service(InjectRepository.Notification)
export class NotificationRepository extends Repository<Notification, NotificationDb> implements INotificationRepository {
    constructor() {
        super(NotificationDb, NOTIFICATION_SCHEMA);
    }

    async findNotification(param: { roleId: string, receiverId: string, type?: NotificationType, skipDate?: Date, limit?: number } & SelectFilterListQuery<Notification>): Promise<Notification[]> {
        let query = this.repository.createQueryBuilder(NOTIFICATION_SCHEMA.TABLE_NAME);

        if (param.skipDate)
            query = query.andWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.CREATED_AT} < :skipDate`, { skipDate: param.skipDate });

        if (param.type)
            query = query.andWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TYPE} = :type`, { type: param.type });

        query.andWhere(new Brackets(qb => {
            qb.where(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TARGET} = :target`, { target: NotificationTarget.All });
            qb.orWhere(new Brackets(qb => {
                qb.where(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TARGET} = :target`, { target: NotificationTarget.Individual })
                    .andWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.RECEIVER_ID} = :receiverId`, { receiverId: param.receiverId });
            }));

            if (param.roleId === RoleId.Client)
                qb.orWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TARGET} = :target`, { target: NotificationTarget.Client });

            if (param.roleId === RoleId.Manager)
                qb.orWhere(`${NOTIFICATION_SCHEMA.TABLE_NAME}.${NOTIFICATION_SCHEMA.COLUMNS.TARGET} = :target`, { target: NotificationTarget.Manager });
        }));

        let limit = param.limit;
        if (!limit)
            limit = 10;

        query.orderBy(`${NOTIFICATION_SCHEMA.TABLE_NAME}.createdAt`, SortType.Desc);
        query.take(limit);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }
}
