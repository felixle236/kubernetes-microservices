export interface IForgotPasswordPayload {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    forgotKey: string;
    forgotExpire: string;
}
