import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
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
import { UpdateClientCommandInput } from './UpdateClientCommandInput';
import { UpdateClientCommandOutput } from './UpdateClientCommandOutput';

@Service()
export class UpdateClientCommandHandler extends CommandHandler<UpdateClientCommandInput, UpdateClientCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string, param: UpdateClientCommandInput, handleOption: HandleOption): Promise<UpdateClientCommandOutput> {
        await validateDataInput(param);

        const data = new Client();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._clientRepository.update(id, data, queryRunner);
            if (hasSucceed) {
                const payload: IAuthUpdateUserPayload | IChatUpdateUserPayload = {
                    id,
                    firstName: data.firstName,
                    lastName: data.lastName
                };
                this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_UPDATED, payload, {}, handleOption);
            }
            const result = new UpdateClientCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
