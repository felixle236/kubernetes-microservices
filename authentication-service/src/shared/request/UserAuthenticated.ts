import { AuthType } from 'domain/enums/AuthType';

export class UserAuthenticated {
    userId: string;
    roleId: string;
    type: AuthType;

    constructor(userId: string, roleId: string, type: AuthType) {
        this.userId = userId;
        this.roleId = roleId;
        this.type = type;
    }
}
