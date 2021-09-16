import { INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { DeleteNotificationCommandOutput } from './DeleteNotificationCommandOutput';

@Service()
export class DeleteNotificationCommandHandler implements CommandHandler<string, DeleteNotificationCommandOutput> {
    @Inject('notification.repository')
    private readonly _notificationRepository: INotificationRepository;

    async handle(id: string): Promise<DeleteNotificationCommandOutput> {
        const notification = await this._notificationRepository.getById(id);
        if (!notification)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'notification');

        const hasSucceed = await this._notificationRepository.softDelete(id);
        const result = new DeleteNotificationCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
