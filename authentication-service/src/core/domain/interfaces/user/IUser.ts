import { UserStatus } from '@domain/enums/user/UserStatus';
import { IAuth } from '../auth/IAuth';
import { IEntity } from '../base/IEntity';

export interface IUser extends IEntity<string> {
    roleId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    status: UserStatus;

    /* Relationship */

    auths: IAuth[] | null;
}
