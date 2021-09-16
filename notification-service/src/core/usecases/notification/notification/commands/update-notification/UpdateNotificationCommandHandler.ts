import { Notification } from '@domain/entities/notification/Notification';
import { INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateNotificationCommandInput } from './UpdateNotificationCommandInput';
import { UpdateNotificationCommandOutput } from './UpdateNotificationCommandOutput';

@Service()
export class UpdateNotificationCommandHandler implements CommandHandler<UpdateNotificationCommandInput, UpdateNotificationCommandOutput> {
    @Inject('notification.repository')
    private readonly _notificationRepository: INotificationRepository;

    async handle(id: string, param: UpdateNotificationCommandInput): Promise<UpdateNotificationCommandOutput> {
        await validateDataInput(param);

        const data = new Notification();
        if (param.title)
            data.title = param.title;
        if (param.content)
            data.content = param.content;
        if (param.contentHtml)
            data.contentHtml = param.contentHtml;

        const notification = await this._notificationRepository.getById(id);
        if (!notification)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'notification');

        const hasSucceed = await this._notificationRepository.update(id, data);
        const result = new UpdateNotificationCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
