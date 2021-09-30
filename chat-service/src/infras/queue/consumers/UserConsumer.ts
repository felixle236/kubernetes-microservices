import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UserExchange } from '@shared/queue/consume/exchanges/UserExchange';
import { ICreateUserPayload } from '@shared/queue/consume/payloads/user/ICreateUserPayload';
import { IDeleteUserPayload } from '@shared/queue/consume/payloads/user/IDeleteUserPayload';
import { IUpdateUserAvatarPayload } from '@shared/queue/consume/payloads/user/IUpdateUserAvatarPayload';
import { IUpdateUserPayload } from '@shared/queue/consume/payloads/user/IUpdateUserPayload';
import { IUpdateUserStatusPayload } from '@shared/queue/consume/payloads/user/IUpdateUserStatusPayload';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { CreateUserCommandHandler } from '@usecases/user/user/commands/create-user/CreateUserCommandHandler';
import { CreateUserCommandInput } from '@usecases/user/user/commands/create-user/CreateUserCommandInput';
import { DeleteUserCommandHandler } from '@usecases/user/user/commands/delete-user/DeleteUserCommandHandler';
import { DeleteUserCommandInput } from '@usecases/user/user/commands/delete-user/DeleteUserCommandInput';
import { UpdateUserAvatarCommandHandler } from '@usecases/user/user/commands/update-user-avatar/UpdateUserAvatarCommandHandler';
import { UpdateUserAvatarCommandInput } from '@usecases/user/user/commands/update-user-avatar/UpdateUserAvatarCommandInput';
import { UpdateUserStatusCommandHandler } from '@usecases/user/user/commands/update-user-status/UpdateUserStatusCommandHandler';
import { UpdateUserStatusCommandInput } from '@usecases/user/user/commands/update-user-status/UpdateUserStatusCommandInput';
import { UpdateUserCommandHandler } from '@usecases/user/user/commands/update-user/UpdateUserCommandHandler';
import { UpdateUserCommandInput } from '@usecases/user/user/commands/update-user/UpdateUserCommandInput';
import { Inject, Service } from 'typedi';

@Service()
export default class UserConsumer {
    @Inject()
    private readonly _createUserCommandHandler: CreateUserCommandHandler;

    @Inject()
    private readonly _updateUserCommandHandler: UpdateUserCommandHandler;

    @Inject()
    private readonly _deleteUserCommandHandler: DeleteUserCommandHandler;

    @Inject()
    private readonly _updateUserStatusCommandHandler: UpdateUserStatusCommandHandler;

    @Inject()
    private readonly _updateUserAvatarCommandHandler: UpdateUserAvatarCommandHandler;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    async init(): Promise<void> {
        await this._queueContext.consumeQueues(UserExchange.EXCHANGE, Object.values(UserExchange.QUEUES));

        await this._queueContext.consume(UserExchange.QUEUES.CHAT_QUEUE_SYNC_USER, async (_channel, key, _msg, payload, handleOption) => {
            if (key === UserExchange.KEYS.USER_EVENT_CREATED) {
                const param = new CreateUserCommandInput();
                const obj = payload as ICreateUserPayload;
                param.id = obj.id;
                param.roleId = obj.roleId;
                param.status = obj.status;
                param.firstName = obj.firstName;
                param.lastName = obj.lastName;
                param.email = obj.email;

                await this._createUserCommandHandler.handle(param, handleOption);
            }
            else if (key === UserExchange.KEYS.USER_EVENT_UPDATED) {
                const param = new UpdateUserCommandInput();
                const obj = payload as IUpdateUserPayload;
                param.id = obj.id;
                param.firstName = obj.firstName;
                param.lastName = obj.lastName;

                await this._updateUserCommandHandler.handle(param, handleOption);
            }
            else if (key === UserExchange.KEYS.USER_EVENT_DELETED) {
                const param = new DeleteUserCommandInput();
                const obj = payload as IDeleteUserPayload;
                param.id = obj.id;

                await this._deleteUserCommandHandler.handle(param, handleOption);
            }
            else if (key === UserExchange.KEYS.USER_EVENT_STATUS_UPDATED) {
                const param = new UpdateUserStatusCommandInput();
                const obj = payload as IUpdateUserStatusPayload;
                param.id = obj.id;
                param.status = obj.status;

                await this._updateUserStatusCommandHandler.handle(param, handleOption);
            }
            else if (key === UserExchange.KEYS.USER_EVENT_AVATAR_UPDATED) {
                const param = new UpdateUserAvatarCommandInput();
                const obj = payload as IUpdateUserAvatarPayload;
                param.id = obj.id;
                param.avatar = obj.avatar;

                await this._updateUserAvatarCommandHandler.handle(param, handleOption);
            }
            else
                throw new SystemError(MessageError.PARAM_NOT_FOUND, 'routing key');
        });
    }
}
