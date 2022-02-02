import { User } from 'domain/entities/User';
import { UserStatus } from 'domain/enums/UserStatus';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AuthDb } from './AuthDb';
import { DbEntity } from '../common/DbEntity';
import { USER_SCHEMA } from '../schemas/UserSchema';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends DbEntity<User> {
    constructor() {
        super(User);
    }

    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
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

    /* Relationship */

    @OneToMany(() => AuthDb, auth => auth.user)
    auths?: AuthDb[];

    /* Handlers */

    override toEntity(): User {
        const entity = super.toEntity();

        entity.roleId = this.roleId;
        entity.firstName = this.firstName;
        entity.lastName = this.lastName;
        entity.email = this.email;
        entity.status = this.status;

        /* Relationship */

        if (this.auths)
            entity.auths = this.auths.map(auth => auth.toEntity());

        return entity;
    }

    override fromEntity(entity: User): void {
        super.fromEntity(entity);

        this.roleId = entity.roleId;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.email = entity.email;
        this.status = entity.status;
    }
}
