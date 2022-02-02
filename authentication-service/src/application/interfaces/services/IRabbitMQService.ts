import { UsecaseOption } from 'shared/usecase/UsecaseOption';

export type AuthEventForgotPasswordPayload = {
    name: string,
    email: string,
    forgotKey: string
}

export interface IRabbitMQService {
    publishAuthEventForgotPassword(payload: AuthEventForgotPasswordPayload, usecaseOption: UsecaseOption): boolean;
}
