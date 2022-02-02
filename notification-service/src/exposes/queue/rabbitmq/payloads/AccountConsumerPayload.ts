import { UserStatus } from 'domain/enums/UserStatus';

export type AccountEventCreatedPayload = {
    id: string,
    roleId: string,
    status: UserStatus,
    firstName: string,
    lastName?: string,
    email: string
}

export type AccountEventUpdatedPayload = {
    id: string,
    status: UserStatus,
    firstName: string,
    lastName?: string
}

export type AccountEventDeletedPayload = {
    id: string
}

export type AccountCmdSendActivationPayload = {
    name: string,
    email: string,
    activeKey: string
}
