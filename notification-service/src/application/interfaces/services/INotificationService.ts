export interface INotificationService {
    sendCustomContent(deviceTokens: string[], title: string, content: string): Promise<void>;

    sendNewUserRegistration(deviceTokens: string[], param: { name: string }): Promise<void>;
}
