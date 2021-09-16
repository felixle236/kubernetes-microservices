import { UserStatus } from '@domain/enums/user/UserStatus';

export interface ICreateUserPayload {
    id: string;
    roleId: string;
    status: UserStatus;
    firstName: string;
    lastName: string | null;
    email: string;
}
