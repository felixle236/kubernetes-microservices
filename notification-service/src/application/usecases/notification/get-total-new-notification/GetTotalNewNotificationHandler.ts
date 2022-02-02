import { INotificationUnreadStatusRepository } from 'application/interfaces/repositories/INotificationUnreadStatusRepository';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { GetTotalNewNotificationOutput } from './GetTotalNewNotificationOutput';

@Service()
export class GetTotalNewNotificationHandler implements IUsecaseHandler<string, GetTotalNewNotificationOutput> {
    constructor(
        @Inject(InjectRepository.NotificationUnreadStatus) private readonly _notificationUnreadStatusRepository: INotificationUnreadStatusRepository
    ) {}

    async handle(usecaseOption: UsecaseOption): Promise<GetTotalNewNotificationOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const result = new GetTotalNewNotificationOutput();
        result.data = await this._notificationUnreadStatusRepository.countUnreadStatus({ userId: usecaseOption.userAuth.userId });
        return result;
    }
}
