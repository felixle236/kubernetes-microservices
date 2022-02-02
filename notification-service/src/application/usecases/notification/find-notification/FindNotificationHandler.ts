import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { FindNotificationInput } from './FindNotificationInput';
import { FindNotificationData, FindNotificationOutput } from './FindNotificationOutput';

@Service()
export class FindNotificationHandler implements IUsecaseHandler<FindNotificationInput, FindNotificationOutput> {
    constructor(
        @Inject(InjectRepository.Notification) private readonly _notificationRepository: INotificationRepository
    ) {}

    async handle(param: FindNotificationInput, usecaseOption: UsecaseOption): Promise<FindNotificationOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const notifications = await this._notificationRepository.findNotification({
            roleId: usecaseOption.userAuth.roleId,
            receiverId: usecaseOption.userAuth.userId,
            type: param.type,
            skipDate: new Date(param.skipDate),
            limit: param.limit
        });

        const result = new FindNotificationOutput();
        result.data = notifications.map(notification => {
            const data = new FindNotificationData();
            data.id = notification.id;
            data.createdAt = notification.createdAt;
            data.type = notification.type;
            data.template = notification.template;
            data.target = notification.target;
            data.receiverId = notification.receiverId;
            data.title = notification.title;
            data.content = notification.content;
            data.contentSpec = notification.contentSpec;

            return data;
        });
        return result;
    }
}
