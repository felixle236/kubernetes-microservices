import { Notification } from 'domain/entities/Notification';
import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { RoleId } from 'domain/enums/RoleId';
import { INotificationRepository } from 'application/interfaces/repositories/INotificationRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { CreateNotificationInput } from './CreateNotificationInput';
import { CreateNotificationOutput } from './CreateNotificationOutput';
import { AddUnreadNotificationStatusHandler } from '../add-unread-notification-status/AddUnreadNotificationStatusHandler';
import { PushNotificationForUserHandler } from '../push-notification-for-user/PushNotificationForUserHandler';

@Service()
export class CreateNotificationHandler implements IUsecaseHandler<CreateNotificationInput, CreateNotificationOutput> {
    constructor(
        @Inject() private readonly _addUnreadNotificationStatusHandler: AddUnreadNotificationStatusHandler,
        @Inject() private readonly _pushNotificationForUserHandler: PushNotificationForUserHandler,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository,
        @Inject(InjectRepository.Notification) private readonly _notificationRepository: INotificationRepository
    ) {}

    async handle(param: CreateNotificationInput): Promise<CreateNotificationOutput> {
        if (param.target === NotificationTarget.Individual && !param.receiverId)
            throw new LogicalError(MessageError.DATA_INVALID);

        if (param.template !== NotificationTemplate.Custom) {
            // TODO: get title, content, contentSpec from notification template.
            param.title = '';
            param.content = '';
            param.contentSpec = '';
        }
        else if (!param.title || !param.content || !param.contentSpec)
            throw new LogicalError(MessageError.DATA_INVALID);

        const data = new Notification();
        data.type = param.type;
        data.template = param.template;
        data.target = param.target;
        data.receiverId = param.receiverId;
        data.title = param.title;
        data.content = param.content;
        data.contentSpec = param.contentSpec;
        const id = await this._notificationRepository.create(data);

        if (id) {
            if (data.target === NotificationTarget.Individual) {
                if (data.receiverId) {
                    await this._addUnreadNotificationStatusHandler.handle({ userId: data.receiverId, notificationId: id });
                    if (param.pushNow) {
                        const user = await this._userRepository.get(data.receiverId);
                        if (user)
                            this._pushNotificationForUserHandler.handle({ user, notification: data });
                    }
                }
            }
            else {
                const roleId = data.target === NotificationTarget.Client ? RoleId.Client : (data.target === NotificationTarget.Manager ? RoleId.Manager : undefined);
                const users = await this._userRepository.findAllUserDevices({ roleId });
                await Promise.all(users.map(user => {
                    if (param.pushNow)
                        this._pushNotificationForUserHandler.handle({ user, notification: data });
                    return this._addUnreadNotificationStatusHandler.handle({ userId: user.id, notificationId: id });
                }));
            }
        }

        const result = new CreateNotificationOutput();
        result.data = id;
        return result;
    }
}
