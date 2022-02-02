import { User } from 'domain/entities/User';
import { UserStatus } from 'domain/enums/UserStatus';
import { UserDevice } from 'domain/value-objects/UserDevice';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { NotificationDb } from './NotificationDb';
import { NotificationUnreadStatusDb } from './NotificationUnreadStatusDb';
import { DbEntity } from '../common/DbEntity';
import { USER_SCHEMA } from '../schemas/UserSchema';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends DbEntity<User> {
    constructor() {
        super(User);
    }

    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    @Index()
    roleId: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, nullable: true })
    lastName?: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.EMAIL })
    @Index({ unique: true, where: DbEntity.getIndexFilterDeletedColumn() })
    email: string;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.Actived })
    status: UserStatus;

    @Column('jsonb', { name: USER_SCHEMA.COLUMNS.DEVICES, nullable: true })
    devices?: UserDevice[];

    /* Relationship */

    @OneToMany(() => NotificationDb, notification => notification.receiver)
    notifications: NotificationDb[];

    @OneToOne(() => NotificationUnreadStatusDb, notificationUnreadStatus => notificationUnreadStatus.user, { createForeignKeyConstraints: false })
    notificationUnreadStatus: NotificationUnreadStatusDb;

    /* Handlers */

    override toEntity(): User {
        const entity = super.toEntity();

        entity.roleId = this.roleId;
        entity.firstName = this.firstName;
        entity.lastName = this.lastName;
        entity.email = this.email;
        entity.status = this.status;
        entity.devices = this.devices;

        /* Relationship */

        if (this.notifications)
            entity.notifications = this.notifications.map(notification => notification.toEntity());

        if (this.notificationUnreadStatus)
            entity.notificationUnreadStatus = this.notificationUnreadStatus.toEntity();

        return entity;
    }

    override fromEntity(entity: User): void {
        super.fromEntity(entity);

        this.roleId = entity.roleId;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.email = entity.email;
        this.status = entity.status;
        this.devices = entity.devices;
    }
}
