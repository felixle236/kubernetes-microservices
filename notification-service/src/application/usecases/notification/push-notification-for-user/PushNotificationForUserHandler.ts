import { Notification } from 'domain/entities/Notification';
import { User } from 'domain/entities/User';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { INotificationService } from 'application/interfaces/services/INotificationService';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';

@Service()
export class PushNotificationForUserHandler implements IUsecaseHandler<{ user: User, notification: Notification }, void> {
    constructor(
        @Inject(InjectService.Notification) private readonly _notificationService: INotificationService
    ) {}

    async handle(param: { user: User, notification: Notification }): Promise<void> {
        const { user, notification } = param;
        if (user.devices && user.devices.length) {
            const deviceTokens = user.devices.filter(device => device.deviceExpire > new Date()).map(device => device.deviceToken);
            if (deviceTokens.length) {
                if (notification.template === NotificationTemplate.Custom)
                    await this._notificationService.sendCustomContent(deviceTokens, notification.title, notification.content);
                else if (notification.template === NotificationTemplate.NewUserRegistration)
                    await this._notificationService.sendNewUserRegistration(deviceTokens, { name: user.firstName });
            }
        }
    }
}
