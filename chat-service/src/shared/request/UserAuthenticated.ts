export class UserAuthenticated {
    userId: string;
    roleId: string;
    type: string;

    constructor(userId: string, roleId: string, type: string) {
        this.userId = userId;
        this.roleId = roleId;
        this.type = type;
    }
}
