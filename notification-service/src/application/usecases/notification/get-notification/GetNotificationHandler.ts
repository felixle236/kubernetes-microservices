import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetNotificationData, GetNotificationOutput } from './GetNotificationOutput';

@Service()
export class GetNotificationHandler implements IUsecaseHandler<string, GetNotificationOutput> {
    constructor(
        @Inject(InjectRepository.Notification) private readonly _notificationRepository: INotificationRepository
    ) {}

    async handle(id: string): Promise<GetNotificationOutput> {
        const notification = await this._notificationRepository.get(id);
        if (!notification)
            throw new NotFoundError();

        const data = new GetNotificationData();
        data.id = notification.id;
        data.createdAt = notification.createdAt;
        data.updatedAt = notification.updatedAt;
        data.type = notification.type;
        data.template = notification.template;
        data.target = notification.target;
        data.receiverId = notification.receiverId;
        data.title = notification.title;
        data.content = notification.content;
        data.contentSpec = notification.contentSpec;

        const result = new GetNotificationOutput();
        result.data = data;
        return result;
    }
}
