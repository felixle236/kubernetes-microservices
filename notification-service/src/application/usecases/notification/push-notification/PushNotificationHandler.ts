import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { RoleId } from 'domain/enums/RoleId';
import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { PushNotificationOutput } from './PushNotificationOutput';
import { PushNotificationForUserHandler } from '../push-notification-for-user/PushNotificationForUserHandler';

@Service()
export class PushNotificationHandler implements IUsecaseHandler<string, PushNotificationOutput> {
    constructor(
        @Inject() private readonly _pushNotificationForUserHandler: PushNotificationForUserHandler,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository,
        @Inject(InjectRepository.Notification) private readonly _notificationRepository: INotificationRepository
    ) {}

    async handle(id: string): Promise<PushNotificationOutput> {
        const notification = await this._notificationRepository.get(id);
        if (!notification)
            throw new NotFoundError();

        if (notification.target === NotificationTarget.Individual) {
            if (notification.receiverId) {
                const user = await this._userRepository.get(notification.receiverId);
                if (user)
                    await this._pushNotificationForUserHandler.handle({ user, notification });
            }
        }
        else {
            const roleId = notification.target === NotificationTarget.Client ? RoleId.Client : (notification.target === NotificationTarget.Manager ? RoleId.Manager : undefined);
            const users = await this._userRepository.findAllUserDevices({ roleId });
            await Promise.all(users.map(user => this._pushNotificationForUserHandler.handle({ user, notification })));
        }

        const result = new PushNotificationOutput();
        result.data = true;
        return result;
    }
}
