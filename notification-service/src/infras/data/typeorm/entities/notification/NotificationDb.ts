import { Notification } from '@domain/entities/notification/Notification';
import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { INotification } from '@domain/interfaces/notification/INotification';
import { Column, Entity, Index } from 'typeorm';
import { NOTIFICATION_SCHEMA } from '../../schemas/notification/NotificationSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(NOTIFICATION_SCHEMA.TABLE_NAME)
@Index((notificationDb: NotificationDb) => [notificationDb.createdAt])
@Index((notificationDb: NotificationDb) => [notificationDb.receiverId, notificationDb.createdAt])
export class NotificationDb extends BaseDbEntity<string, Notification> implements INotification {
    @Column('enum', { name: NOTIFICATION_SCHEMA.COLUMNS.TYPE, enum: NotificationType })
    type: NotificationType;

    @Column('enum', { name: NOTIFICATION_SCHEMA.COLUMNS.TARGET, enum: NotificationTarget })
    target: NotificationTarget;

    @Column('uuid', { name: NOTIFICATION_SCHEMA.COLUMNS.RECEIVER_ID, nullable: true })
    receiverId: string | null;

    @Column('bool', { name: NOTIFICATION_SCHEMA.COLUMNS.IS_READ, default: false })
    isRead: boolean;

    @Column('varchar', { name: NOTIFICATION_SCHEMA.COLUMNS.TITLE, length: 60, nullable: true })
    title: string | null;

    @Column('varchar', { name: NOTIFICATION_SCHEMA.COLUMNS.CONTENT, length: 250 })
    content: string;

    @Column('varchar', { name: NOTIFICATION_SCHEMA.COLUMNS.CONTENT_HTML, length: 1000 })
    contentHtml: string;

    /* Relationship */

    /* Handlers */

    toEntity(): Notification {
        return new Notification(this);
    }

    fromEntity(entity: Notification): INotification {
        return entity.toData();
    }
}
