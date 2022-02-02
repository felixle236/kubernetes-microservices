export type AuthEventForgotPasswordPayload = {
    name: string,
    email: string,
    forgotKey: string
}

export type AuthEventUpdateDeviceTokenPayload = {
    userId: string,
    deviceToken: string,
    deviceExpire: Date
}
