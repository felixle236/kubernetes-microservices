import { User } from '@domain/entities/user/User';
import { UserStatus } from '@domain/enums/user/UserStatus';
import { IChat } from '@domain/interfaces/chat/IChat';
import { IChatChannelUser } from '@domain/interfaces/chat/IChatChannelUser';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, Index } from 'typeorm';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(USER_SCHEMA.TABLE_NAME)
export class UserDb extends BaseDbEntity<string, User> implements IUser {
    @Column('uuid', { name: USER_SCHEMA.COLUMNS.ROLE_ID })
    roleId: string;

    @Column('enum', { name: USER_SCHEMA.COLUMNS.STATUS, enum: UserStatus, default: UserStatus.Actived })
    status: UserStatus;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.FIRST_NAME })
    firstName: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.LAST_NAME, nullable: true })
    lastName: string | null;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.EMAIL })
    @Index({ unique: true, where: UserDb.getIndexFilterDeletedColumn() })
    email: string;

    @Column('varchar', { name: USER_SCHEMA.COLUMNS.AVATAR, nullable: true })
    avatar: string | null;

    /* Relationship */

    chatChannelUsers: IChatChannelUser[] | null;
    chatSenders: IChat[] | null;
    chatReceivers: IChat[] | null;

    /* Handlers */

    toEntity(): User {
        return new User(this);
    }

    fromEntity(entity: User): IUser {
        return entity.toData();
    }
}
