import { RoleId } from '@domain/enums/user/RoleId';
import { INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetNotificationByIdQueryOutput } from './GetNotificationByIdQueryOutput';

@Service()
export class GetNotificationByIdQueryHandler implements QueryHandler<string, GetNotificationByIdQueryOutput> {
    @Inject('notification.repository')
    private readonly _notificationRepository: INotificationRepository;

    async handle(id: string, handleOption: HandleOption): Promise<GetNotificationByIdQueryOutput> {
        if (!handleOption.userAuth)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const notification = await this._notificationRepository.getById(id);
        if (!notification)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'notification');

        if (handleOption.userAuth.roleId !== RoleId.SuperAdmin && notification.receiverId !== handleOption.userAuth.userId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const result = new GetNotificationByIdQueryOutput();
        result.setData(notification);
        return result;
    }
}
