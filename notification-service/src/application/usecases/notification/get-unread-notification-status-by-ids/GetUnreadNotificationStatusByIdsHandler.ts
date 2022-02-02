import { INotificationUnreadStatusRepository } from 'application/interfaces/repositories/INotificationUnreadStatusRepository';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { GetUnreadNotificationStatusByIdsInput } from './GetUnreadNotificationStatusByIdsInput';
import { GetUnreadNotificationStatusByIdsOutput } from './GetUnreadNotificationStatusByIdsOutput';

@Service()
export class GetUnreadNotificationStatusByIdsHandler implements IUsecaseHandler<GetUnreadNotificationStatusByIdsInput, GetUnreadNotificationStatusByIdsOutput> {
    constructor(
        @Inject(InjectRepository.NotificationUnreadStatus) private readonly _notificationUnreadStatusRepository: INotificationUnreadStatusRepository
    ) {}

    async handle(param: GetUnreadNotificationStatusByIdsInput, usecaseOption: UsecaseOption): Promise<GetUnreadNotificationStatusByIdsOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const notificationIds = await this._notificationUnreadStatusRepository.findUnreadStatuses({
            userId: usecaseOption.userAuth.userId,
            notificationIds: param.ids
        });
        const obj = {} as any;
        param.ids.forEach(id => {
            obj[id] = notificationIds.includes(id);
        });

        const result = new GetUnreadNotificationStatusByIdsOutput();
        result.data = obj;
        return result;
    }
}
