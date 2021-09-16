import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';

export interface IAuthCreateUserPayload {
    id: string;
    roleId: string;
    status: ManagerStatus | ClientStatus;
    firstName: string;
    lastName: string | null;
    email: string;
}
