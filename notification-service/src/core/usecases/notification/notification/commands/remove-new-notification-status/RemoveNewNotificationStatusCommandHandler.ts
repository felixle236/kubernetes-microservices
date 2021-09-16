import { INotificationStatusRepository } from '@gateways/repositories/notification/INotificationStatusRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { RemoveNewNotificationStatusCommandInput } from './RemoveNewNotificationStatusCommandInput';
import { RemoveNewNotificationStatusCommandOutput } from './RemoveNewNotificationStatusCommandOutput';

@Service()
export class RemoveNewNotificationStatusCommandHandler implements CommandHandler<RemoveNewNotificationStatusCommandInput, RemoveNewNotificationStatusCommandOutput> {
    @Inject('notification_status.repository')
    private readonly _notificationStatusRepository: INotificationStatusRepository;

    async handle(param: RemoveNewNotificationStatusCommandInput): Promise<RemoveNewNotificationStatusCommandOutput> {
        await validateDataInput(param);

        const hasSucceed = await this._notificationStatusRepository.removeNewNotificationStatus(param.receiverId);
        const result = new RemoveNewNotificationStatusCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
