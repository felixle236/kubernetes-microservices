import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';

export interface IAuthUpdateUserStatusPayload {
    id: string;
    status: ManagerStatus | ClientStatus;
}
