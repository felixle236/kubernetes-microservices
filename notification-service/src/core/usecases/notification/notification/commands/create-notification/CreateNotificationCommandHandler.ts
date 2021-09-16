import { Notification } from '@domain/entities/notification/Notification';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateNotificationCommandInput } from './CreateNotificationCommandInput';
import { CreateNotificationCommandOutput } from './CreateNotificationCommandOutput';
import { PushNotificationCommandHandler } from '../push-notification/PushNotificationCommandHandler';

@Service()
export class CreateNotificationCommandHandler implements CommandHandler<CreateNotificationCommandInput, CreateNotificationCommandOutput> {
    @Inject()
    private readonly _pushNotificationHandler: PushNotificationCommandHandler;

    @Inject('notification.repository')
    private readonly _notificationRepository: INotificationRepository;

    async handle(param: CreateNotificationCommandInput): Promise<CreateNotificationCommandOutput> {
        await validateDataInput(param);

        const data = new Notification();
        data.type = NotificationType.Other;
        data.target = param.target;
        data.receiverId = param.receiverId;
        data.title = param.title;
        data.content = param.content;

        const id = await this._notificationRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._pushNotificationHandler.handle(id);
        const result = new CreateNotificationCommandOutput();
        result.setData(id);
        return result;
    }
}
