import { NotificationUnreadStatus } from 'domain/entities/NotificationUnreadStatus';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { UserDb } from './UserDb';
import { DbEntity } from '../common/DbEntity';
import { NOTIFICATION_UNREAD_STATUS_SCHEMA } from '../schemas/NotificationUnreadStatusSchema';

@Entity(NOTIFICATION_UNREAD_STATUS_SCHEMA.TABLE_NAME)
export class NotificationUnreadStatusDb extends DbEntity<NotificationUnreadStatus> {
    constructor() {
        super(NotificationUnreadStatus);
    }

    @Column('uuid', { name: NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.USER_ID })
    @Index({ unique: true, where: DbEntity.getIndexFilterDeletedColumn() })
    userId: string;

    @Column('uuid', { name: NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.NOTIFICATION_IDS, array: true })
    notificationIds: string[];

    /* Relationship */

    @OneToOne(() => UserDb, user => user.notificationUnreadStatus, { createForeignKeyConstraints: false })
    @JoinColumn({ name: NOTIFICATION_UNREAD_STATUS_SCHEMA.COLUMNS.USER_ID })
    user?: UserDb;

    /* Handlers */

    override toEntity(): NotificationUnreadStatus {
        const entity = super.toEntity();
        entity.userId = this.userId;
        entity.notificationIds = this.notificationIds;

        /* Relationship */

        if (this.user)
            entity.user = this.user.toEntity();

        return entity;
    }

    override fromEntity(entity: NotificationUnreadStatus): void {
        super.fromEntity(entity);
        this.userId = entity.userId;
        this.notificationIds = entity.notificationIds;
    }
}
