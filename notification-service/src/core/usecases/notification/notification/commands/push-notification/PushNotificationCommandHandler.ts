import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { INotificationRepository } from '@gateways/repositories/notification/INotificationRepository';
import { INotificationStatusRepository } from '@gateways/repositories/notification/INotificationStatusRepository';
import { ILogService } from '@gateways/services/ILogService';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { NotificationNS } from '@shared/socket/namespaces/NotificationNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { PushNotificationCommandOutput } from './PushNotificationCommandOutput';

@Service()
export class PushNotificationCommandHandler implements CommandHandler<string, PushNotificationCommandOutput> {
    @Inject('notification.repository')
    private readonly _notificationRepository: INotificationRepository;

    @Inject('notification_status.repository')
    private readonly _notificationStatusRepository: INotificationStatusRepository;

    // @Inject('notification.service')
    // private readonly _notificationService: INotificationService;

    @Inject('socket_emitter.service')
    private readonly _socketEmitterService: ISocketEmitterService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    async handle(id: string): Promise<PushNotificationCommandOutput> {
        const notification = await this._notificationRepository.getById(id);
        if (!notification)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'notification');

        this._logService.debug('Send notification', notification);
        const result = new PushNotificationCommandOutput();
        result.setData(false);

        // TODO: need to integrate with message queue for notify to realtime server or mobile device.

        if (notification.target === NotificationTarget.Individual && notification.receiverId) {
            this._socketEmitterService.send(NotificationNS.NAME, NotificationNS.EVENTS.REALTIME_NOTIFY, notification.receiverId, notification);
            await this._notificationStatusRepository.updateNewNotificationStatus(notification.receiverId);

            // const userApp = await this._userAppRepository.getByUser(notification.receiverId);
            // if (userApp)
            //     this._notificationService.send([userApp.deviceId], notification.title, notification.content, notification.meta);

            result.setData(true);
        }
        else if (notification.target === NotificationTarget.All) {
            this._socketEmitterService.sendAll(NotificationNS.NAME, NotificationNS.EVENTS.REALTIME_NOTIFY, notification);
            // TODO: push notification

            result.setData(true);
        }
        return result;
    }
}
