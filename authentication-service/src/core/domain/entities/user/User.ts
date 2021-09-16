import { RoleId } from '@domain/enums/user/RoleId';
import { UserStatus } from '@domain/enums/user/UserStatus';
import { IUser } from '@domain/interfaces/user/IUser';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { isEmail, isEnum, isUUID } from 'class-validator';
import { Auth } from '../auth/Auth';
import { BaseEntity } from '../base/BaseEntity';

export class UserBase<T extends IUser> extends BaseEntity<string, T> implements IUser {
    get roleId(): string {
        return this.data.roleId;
    }

    set roleId(val: string) {
        if (!isUUID(val) || !isEnum(val, RoleId))
            throw new SystemError(MessageError.PARAM_INVALID, 'role');

        this.data.roleId = val;
    }

    get firstName(): string {
        return this.data.firstName;
    }

    set firstName(val: string) {
        val = val.trim();
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'first name');
        this.data.firstName = val;
    }

    get lastName(): string | null {
        return this.data.lastName;
    }

    set lastName(val: string | null) {
        if (val)
            val = val.trim();
        this.data.lastName = val;
    }

    get email(): string {
        return this.data.email;
    }

    set email(val: string) {
        val = val.trim().toLowerCase();
        if (!isEmail(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        this.data.email = val;
    }

    get status(): UserStatus {
        return this.data.status;
    }

    set status(val: UserStatus) {
        this.data.status = val;
    }

    /* Relationship */

    get auths(): Auth[] | null {
        return this.data.auths ? this.data.auths.map(auth => new Auth(auth)) : null;
    }

    /* Handlers */
}

export class User extends UserBase<IUser> {}
