import { Notification } from 'domain/entities/Notification';
import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { NotificationType } from 'domain/enums/NotificationType';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UserDb } from './UserDb';
import { DbEntity } from '../common/DbEntity';
import { NOTIFICATION_SCHEMA } from '../schemas/NotificationSchema';

@Entity(NOTIFICATION_SCHEMA.TABLE_NAME)
@Index((notificationDb: NotificationDb) => [notificationDb.createdAt])
export class NotificationDb extends DbEntity<Notification> {
    constructor() {
        super(Notification);
    }

    @Column('enum', { name: NOTIFICATION_SCHEMA.COLUMNS.TYPE, enum: NotificationType })
    type: NotificationType;

    @Column('enum', { name: NOTIFICATION_SCHEMA.COLUMNS.TEMPLATE, enum: NotificationTemplate })
    template: NotificationTemplate;

    @Column('enum', { name: NOTIFICATION_SCHEMA.COLUMNS.TARGET, enum: NotificationTarget })
    target: NotificationTarget;

    @Column('uuid', { name: NOTIFICATION_SCHEMA.COLUMNS.RECEIVER_ID, nullable: true })
    receiverId?: string;

    @Column('varchar', { name: NOTIFICATION_SCHEMA.COLUMNS.TITLE, length: 40 })
    title: string;

    @Column('varchar', { name: NOTIFICATION_SCHEMA.COLUMNS.CONTENT, length: 80 })
    content: string;

    @Column('varchar', { name: NOTIFICATION_SCHEMA.COLUMNS.CONTENT_SPEC, length: 200 })
    contentSpec: string;

    /* Relationship */

    @ManyToOne(() => UserDb, user => user.notifications, { createForeignKeyConstraints: false })
    @JoinColumn({ name: NOTIFICATION_SCHEMA.COLUMNS.RECEIVER_ID })
    receiver?: UserDb;

    /* Handlers */

    override toEntity(): Notification {
        const entity = super.toEntity();
        entity.type = this.type;
        entity.template = this.template;
        entity.target = this.target;
        entity.receiverId = this.receiverId;
        entity.title = this.title;
        entity.content = this.content;
        entity.contentSpec = this.contentSpec;

        /* Relationship */

        if (this.receiver)
            entity.receiver = this.receiver.toEntity();

        return entity;
    }

    override fromEntity(entity: Notification): void {
        super.fromEntity(entity);
        this.type = entity.type;
        this.template = entity.template;
        this.target = entity.target;
        this.receiverId = entity.receiverId;
        this.title = entity.title;
        this.content = entity.content;
        this.contentSpec = entity.contentSpec;
    }
}
