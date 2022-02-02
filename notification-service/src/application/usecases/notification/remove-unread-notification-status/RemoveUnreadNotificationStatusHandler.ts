import { NotificationUnreadStatus } from 'domain/entities/NotificationUnreadStatus';
import { INotificationUnreadStatusRepository } from 'application/interfaces/repositories/INotificationUnreadStatusRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { RemoveUnreadNotificationStatusInput } from './RemoveUnreadNotificationStatusInput';
import { RemoveUnreadNotificationStatusOutput } from './RemoveUnreadNotificationStatusOutput';

@Service()
export class RemoveUnreadNotificationStatusHandler implements IUsecaseHandler<RemoveUnreadNotificationStatusInput, RemoveUnreadNotificationStatusOutput> {
    constructor(
        @Inject(InjectRepository.NotificationUnreadStatus) private readonly _notificationUnreadStatusRepository: INotificationUnreadStatusRepository
    ) {}

    async handle(param: RemoveUnreadNotificationStatusInput): Promise<RemoveUnreadNotificationStatusOutput> {
        const notificationUnreadStatus = await this._notificationUnreadStatusRepository.getByUser(param.userId);
        if (notificationUnreadStatus) {
            const notificationIds = (notificationUnreadStatus.notificationIds || []).filter(notificationId => notificationId !== param.notificationId);
            const data = new NotificationUnreadStatus();
            data.notificationIds = notificationIds;
            await this._notificationUnreadStatusRepository.update(notificationUnreadStatus.id, data);
        }
        const result = new RemoveUnreadNotificationStatusOutput();
        result.data = true;
        return result;
    }
}
