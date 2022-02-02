export interface INotificationProvider {
    send(deviceTokens: string[], title: string, content: string): Promise<any>;
    send<T>(deviceTokens: string[], title: string, content: string, meta: T): Promise<any>;
}
