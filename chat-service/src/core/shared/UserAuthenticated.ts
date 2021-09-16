export class UserAuthenticated {
    userId: string;
    roleId: string;

    constructor(userId: string, roleId: string) {
        this.userId = userId;
        this.roleId = roleId;
    }
}
