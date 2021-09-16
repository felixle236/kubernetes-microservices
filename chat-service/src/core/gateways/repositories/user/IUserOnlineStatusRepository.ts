export class OnlineStatus {
    constructor(public isOnline: boolean, public onlineAt: Date) {}
}

export class UserOnlineStatus {
    constructor(public id: string, public status: OnlineStatus) {}
}

export interface IUserOnlineStatusRepository {
    getListOnlineStatusByIds(ids: string[]): Promise<UserOnlineStatus[]>;

    updateUserOnlineStatus(id: string, data: OnlineStatus): Promise<boolean>;
}
