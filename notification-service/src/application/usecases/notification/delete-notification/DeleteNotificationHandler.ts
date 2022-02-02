import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { RoleId } from 'domain/enums/RoleId';
import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteNotificationOutput } from './DeleteNotificationOutput';
import { RemoveUnreadNotificationStatusHandler } from '../remove-unread-notification-status/RemoveUnreadNotificationStatusHandler';

@Service()
export class DeleteNotificationHandler implements IUsecaseHandler<string, DeleteNotificationOutput> {
    constructor(
        @Inject() private readonly _removeUnreadNotificationStatusHandler: RemoveUnreadNotificationStatusHandler,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository,
        @Inject(InjectRepository.Notification) private readonly _notificationRepository: INotificationRepository
    ) {}

    async handle(id: string): Promise<DeleteNotificationOutput> {
        const notification = await this._notificationRepository.get(id);
        if (!notification)
            throw new NotFoundError();

        if (notification.target === NotificationTarget.Individual) {
            if (notification.receiverId)
                await this._removeUnreadNotificationStatusHandler.handle({ userId: notification.receiverId, notificationId: id });
        }
        else {
            const roleId = notification.target === NotificationTarget.Client ? RoleId.Client : (notification.target === NotificationTarget.Manager ? RoleId.Manager : undefined);
            const users = await this._userRepository.findAllUserDevices({ roleId });
            await Promise.all(users.map(user => {
                return this._removeUnreadNotificationStatusHandler.handle({ userId: user.id, notificationId: id });
            }));
        }

        const result = new DeleteNotificationOutput();
        result.data = await this._notificationRepository.delete(id);
        return result;
    }
}
