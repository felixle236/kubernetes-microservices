import { Entity } from 'domain/common/Entity';
import { UserStatus } from 'domain/enums/UserStatus';
import { Auth } from './Auth';

export class User extends Entity {
    roleId: string;
    firstName: string;
    lastName?: string;
    email: string;
    status: UserStatus;

    /* Relationship */

    auths?: Auth[];

    /* Handlers */
}
