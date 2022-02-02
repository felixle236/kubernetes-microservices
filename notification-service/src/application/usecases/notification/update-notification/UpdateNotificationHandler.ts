import { Notification } from 'domain/entities/Notification';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateNotificationInput } from './UpdateNotificationInput';
import { UpdateNotificationOutput } from './UpdateNotificationOutput';

@Service()
export class UpdateNotificationHandler implements IUsecaseHandler<UpdateNotificationInput, UpdateNotificationOutput> {
    constructor(
        @Inject(InjectRepository.Notification) private readonly _notificationRepository: INotificationRepository
    ) {}

    async handle(id: string, param: UpdateNotificationInput): Promise<UpdateNotificationOutput> {
        const notification = await this._notificationRepository.get(id);
        if (!notification)
            throw new NotFoundError();

        if (param.template !== NotificationTemplate.Custom) {
            // TODO: get title, content, contentSpec from notification template.
            param.title = '';
            param.content = '';
            param.contentSpec = '';
        }
        else if (!param.title || !param.content || !param.contentSpec)
            throw new LogicalError(MessageError.DATA_INVALID);

        const data = new Notification();
        data.type = param.type;
        data.template = param.template;
        data.title = param.title;
        data.content = param.content;
        data.contentSpec = param.contentSpec;

        const result = new UpdateNotificationOutput();
        result.data = await this._notificationRepository.update(id, data);
        return result;
    }
}
