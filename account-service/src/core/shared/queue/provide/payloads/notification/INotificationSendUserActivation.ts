export interface INotificationSendUserActivation {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    activeKey: string;
    activeExpire: string;
}
