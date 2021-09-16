import { UserStatus } from '@domain/enums/user/UserStatus';

export interface IUpdateUserStatusPayload {
    id: string;
    status: UserStatus;
}
