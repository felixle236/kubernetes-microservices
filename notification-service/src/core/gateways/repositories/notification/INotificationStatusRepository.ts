export interface INotificationStatusRepository {
    getNewNotificationStatusById(id: string): Promise<number>;

    updateNewNotificationStatus(id: string): Promise<number | null>;

    removeNewNotificationStatus(id: string): Promise<boolean>;
}
