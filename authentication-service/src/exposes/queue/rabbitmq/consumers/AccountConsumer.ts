import { CreateUserHandler } from 'application/usecases/user/create-user/CreateUserHandler';
import { CreateUserInput } from 'application/usecases/user/create-user/CreateUserInput';
import { DeleteUserHandler } from 'application/usecases/user/delete-user/DeleteUserHandler';
import { UpdateUserHandler } from 'application/usecases/user/update-user/UpdateUserHandler';
import { UpdateUserInput } from 'application/usecases/user/update-user/UpdateUserInput';
import { ConsumerQueue } from 'shared/queue/rabbitmq/definitions/ConsumerQueue';
import { IRabbitMQContext } from 'shared/queue/rabbitmq/IRabbitMQContext';
import { InjectQueue } from 'shared/types/Injection';
import { Inject, Service } from 'typedi';
import { validateDataInput } from 'utils/Validator';
import { AccountEventCreatedPayload, AccountEventDeletedPayload, AccountEventUpdatedPayload } from '../payloads/AccountConsumerPayload';

@Service()
export default class AccountConsumer {
    constructor(
        @Inject(InjectQueue.RabbitMQContext) private readonly _rabbitMQContext: IRabbitMQContext,
        @Inject() private readonly _createUserHandler: CreateUserHandler,
        @Inject() private readonly _updateUserHandler: UpdateUserHandler,
        @Inject() private readonly _deleteUserHandler: DeleteUserHandler
    ) {}

    async init(): Promise<void> {
        await this._rabbitMQContext.initConsumerQueues(ConsumerQueue.QUEUES);

        await this._rabbitMQContext.consume<AccountEventCreatedPayload>(ConsumerQueue.QUEUES.CREATE_ACCOUNT, async (_channel, _key, _msg, payload, _usecaseOption) => {
            const param = new CreateUserInput();
            param.id = payload.id;
            param.roleId = payload.roleId;
            param.status = payload.status;
            param.firstName = payload.firstName;
            param.lastName = payload.lastName;
            param.email = payload.email;

            await validateDataInput(param);
            await this._createUserHandler.handle(param);
        });

        await this._rabbitMQContext.consume<AccountEventUpdatedPayload>(ConsumerQueue.QUEUES.UPDATE_ACCOUNT, async (_channel, _key, _msg, payload, _usecaseOption) => {
            const param = new UpdateUserInput();
            param.status = payload.status;
            param.firstName = payload.firstName;
            param.lastName = payload.lastName;

            await validateDataInput(param);
            await this._updateUserHandler.handle(payload.id, param);
        });

        await this._rabbitMQContext.consume<AccountEventDeletedPayload>(ConsumerQueue.QUEUES.DELETE_ACCOUNT, async (_channel, _key, _msg, payload, _usecaseOption) => {
            await this._deleteUserHandler.handle(payload.id);
        });
    }
}
