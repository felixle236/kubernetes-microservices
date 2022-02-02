import { ClientStatus } from 'domain/enums/ClientStatus';
import { ManagerStatus } from 'domain/enums/ManagerStatus';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';

export type AccountEventCreatedPayload = {
    id: string,
    roleId: string,
    status: ManagerStatus | ClientStatus,
    firstName: string,
    lastName?: string,
    email: string
}

export type AccountEventUpdatedPayload = {
    id: string,
    status: ManagerStatus | ClientStatus,
    firstName: string,
    lastName?: string,
    avatar?: string
}

export type AccountEventDeletedPayload = {
    id: string
}

export type AccountCmdSendActivationPayload = {
    name: string,
    email: string,
    activeKey: string
}

export interface IRabbitMQService {
    publishAccountEventUserCreated(payload: AccountEventCreatedPayload, usecaseOption: UsecaseOption): boolean;

    publishAccountEventUserUpdated(payload: AccountEventUpdatedPayload, usecaseOption: UsecaseOption): boolean;

    publishAccountEventUserDeleted(payload: AccountEventDeletedPayload, usecaseOption: UsecaseOption): boolean;

    publishAccountCmdSendActivation(payload: AccountCmdSendActivationPayload, usecaseOption: UsecaseOption): boolean;

    publishAccountCmdResendActivation(payload: AccountCmdSendActivationPayload, usecaseOption: UsecaseOption): boolean;
}
