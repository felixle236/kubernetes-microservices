import { Manager } from '@domain/entities/user/Manager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { IAuthUpdateUserPayload } from '@shared/queue/provide/payloads/auth/IAuthUpdateUserPayload';
import { IChatUpdateUserPayload } from '@shared/queue/provide/payloads/chat/IChatUpdateUserPayload';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateManagerCommandInput } from './UpdateManagerCommandInput';
import { UpdateManagerCommandOutput } from './UpdateManagerCommandOutput';

@Service()
export class UpdateManagerCommandHandler extends CommandHandler<UpdateManagerCommandInput, UpdateManagerCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string, param: UpdateManagerCommandInput, handleOption: HandleOption): Promise<UpdateManagerCommandOutput> {
        await validateDataInput(param);

        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;

        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._managerRepository.update(id, data, queryRunner);
            if (hasSucceed) {
                const payload: IAuthUpdateUserPayload | IChatUpdateUserPayload = {
                    id,
                    firstName: data.firstName,
                    lastName: data.lastName
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_UPDATED, payload, {}, handleOption);
            }
            const result = new UpdateManagerCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
