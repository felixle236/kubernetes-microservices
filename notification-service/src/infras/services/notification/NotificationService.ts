import { INotificationService } from 'application/interfaces/services/INotificationService';
import { InjectService } from 'shared/types/Injection';
import { Service } from 'typedi';
import { NotificationSender } from './sender/NotificationSender';

@Service(InjectService.Notification)
export class NotificationService implements INotificationService {
    private readonly _sender: NotificationSender;

    constructor() {
        this._sender = new NotificationSender();
    }

    async sendCustomContent(deviceTokens: string[], title: string, content: string): Promise<void> {
        await this._sender.send(deviceTokens, title, content);
    }

    async sendNewUserRegistration(deviceTokens: string[], payload: { name: string }): Promise<void> {
        await this._sender.send(deviceTokens, 'User Registration', `New user registration: "${payload.name}"`);
    }
}
