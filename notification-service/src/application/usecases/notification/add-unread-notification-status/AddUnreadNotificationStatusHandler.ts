import { NotificationUnreadStatus } from 'domain/entities/NotificationUnreadStatus';
import { INotificationUnreadStatusRepository } from 'application/interfaces/repositories/INotificationUnreadStatusRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { AddUnreadNotificationStatusInput } from './AddUnreadNotificationStatusInput';
import { AddUnreadNotificationStatusOutput } from './AddUnreadNotificationStatusOutput';

@Service()
export class AddUnreadNotificationStatusHandler implements IUsecaseHandler<AddUnreadNotificationStatusInput, AddUnreadNotificationStatusOutput> {
    constructor(
        @Inject(InjectRepository.NotificationUnreadStatus) private readonly _notificationUnreadStatusRepository: INotificationUnreadStatusRepository
    ) {}

    async handle(param: AddUnreadNotificationStatusInput): Promise<AddUnreadNotificationStatusOutput> {
        let hasSucceed = false;
        const notificationUnreadStatus = await this._notificationUnreadStatusRepository.getByUser(param.userId);
        if (!notificationUnreadStatus) {
            const data = new NotificationUnreadStatus();
            data.userId = param.userId;
            data.notificationIds = [param.notificationId];
            const id = await this._notificationUnreadStatusRepository.create(data);
            hasSucceed = !!id;
        }
        else {
            const notificationIds = (notificationUnreadStatus.notificationIds || []);
            if (!notificationIds.find(notificationId => notificationId === param.notificationId)) {
                notificationIds.push(param.notificationId);
                const data = new NotificationUnreadStatus();
                data.notificationIds = notificationIds;
                hasSucceed = await this._notificationUnreadStatusRepository.update(notificationUnreadStatus.id, data);
            }
        }

        const result = new AddUnreadNotificationStatusOutput();
        result.data = hasSucceed;
        return result;
    }
}
