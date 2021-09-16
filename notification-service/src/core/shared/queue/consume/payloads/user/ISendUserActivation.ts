export interface ISendUserActivation {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    activeKey: string;
    activeExpire: string;
}
