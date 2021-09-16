import { INotificationStatusRepository } from '@gateways/repositories/notification/INotificationStatusRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CountNewNotificationStatusQueryInput } from './CountNewNotificationStatusQueryInput';
import { CountNewNotificationStatusQueryOutput } from './CountNewNotificationStatusQueryOutput';

@Service()
export class CountNewNotificationStatusQueryHandler implements QueryHandler<CountNewNotificationStatusQueryInput, CountNewNotificationStatusQueryOutput> {
    @Inject('notification_status.repository')
    private readonly _notificationStatusRepository: INotificationStatusRepository;

    async handle(param: CountNewNotificationStatusQueryInput): Promise<CountNewNotificationStatusQueryOutput> {
        await validateDataInput(param);

        const data = await this._notificationStatusRepository.getNewNotificationStatusById(param.receiverId);
        const result = new CountNewNotificationStatusQueryOutput();
        result.setData(data);
        return result;
    }
}
