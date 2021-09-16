import crypto from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { UserStatus } from '@domain/enums/user/UserStatus';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { AuthExchange } from '@shared/queue/provide/exchanges/AuthExchange';
import { INotificationForgotPasswordPayload } from '@shared/queue/provide/payloads/notification/INotificationForgotPasswordPayload';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { addSeconds } from '@utils/datetime';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ForgotPasswordByEmailCommandInput } from './ForgotPasswordByEmailCommandInput';
import { ForgotPasswordByEmailCommandOutput } from './ForgotPasswordByEmailCommandOutput';

@Service()
export class ForgotPasswordByEmailCommandHandler extends CommandHandler<ForgotPasswordByEmailCommandInput, ForgotPasswordByEmailCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: ForgotPasswordByEmailCommandInput, handleOption: HandleOption): Promise<ForgotPasswordByEmailCommandOutput> {
        await validateDataInput(param);

        const user = await this._userRepository.getByEmail(param.email);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'email');

        if (user.status !== UserStatus.Actived)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'user');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account authorization');

        const forgotKey = crypto.randomBytes(32).toString('hex');
        const forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const data = new Auth();
        data.forgotKey = forgotKey;
        data.forgotExpire = forgotExpire;

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const hasSucceed = await this._authRepository.update(auth.id, data, queryRunner);
            if (hasSucceed) {
                const payload: INotificationForgotPasswordPayload = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    forgotKey,
                    forgotExpire: forgotExpire.toISOString()
                };
                this._queueContext.publish(AuthExchange.EXCHANGE, AuthExchange.KEYS.AUTH_EVENT_FORGOT_PASSWORD, payload, {}, handleOption);
            }
            const result = new ForgotPasswordByEmailCommandOutput();
            result.setData(hasSucceed);
            return result;
        });
    }
}
