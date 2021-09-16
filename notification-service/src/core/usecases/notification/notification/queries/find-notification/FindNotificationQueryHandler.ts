import { RoleId } from '@domain/enums/user/RoleId';
import { FindNotificationFilter, INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindNotificationQueryInput } from './FindNotificationQueryInput';
import { FindNotificationQueryOutput } from './FindNotificationQueryOutput';

@Service()
export class FindNotificationQueryHandler implements QueryHandler<FindNotificationQueryInput, FindNotificationQueryOutput> {
    @Inject('notification.repository')
    private readonly _notificationRepository: INotificationRepository;

    async handle(param: FindNotificationQueryInput, handleOption: HandleOption): Promise<FindNotificationQueryOutput> {
        if (!handleOption.userAuth)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const filter = new FindNotificationFilter();
        filter.type = param.type;
        if (handleOption.userAuth.roleId === RoleId.SuperAdmin)
            filter.receiverId = param.receiverId;
        else
            filter.receiverId = handleOption.userAuth.userId;
        filter.skipDate = new Date(param.skipTime);
        filter.limit = param.limit;

        const notifications = await this._notificationRepository.find(filter);
        const result = new FindNotificationQueryOutput();
        result.setData(notifications);
        return result;
    }
}
