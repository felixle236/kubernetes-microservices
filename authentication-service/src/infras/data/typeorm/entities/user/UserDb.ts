import { User } from '@domain/entities/user/User';
import { UserStatus } from '@domain/enums/user/UserStatus';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, Index } from 'typeorm';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends BaseDbEntity<string, User> implements IUser {
    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    @Index()
    roleId: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, nullable: true })
    lastName: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.EMAIL })
    @Index({ unique: true, where: UserDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.Actived })
    status: UserStatus;

    /* Relationship */

    auths: IAuth[] | null;

    /* Handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity: User): IUser {
        return entity.toData();
    }
}
