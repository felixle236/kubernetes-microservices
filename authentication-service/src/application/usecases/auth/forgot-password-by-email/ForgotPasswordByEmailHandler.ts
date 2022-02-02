import { randomBytes } from 'crypto';
import { Auth } from 'domain/entities/Auth';
import { UserStatus } from 'domain/enums/UserStatus';
import { IAuthRepository } from 'application/interfaces/repositories/IAuthRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { addSeconds } from 'utils/Datetime';
import { ForgotPasswordByEmailInput } from './ForgotPasswordByEmailInput';
import { ForgotPasswordByEmailOutput } from './ForgotPasswordByEmailOutput';

@Service()
export class ForgotPasswordByEmailHandler implements IUsecaseHandler<ForgotPasswordByEmailInput, ForgotPasswordByEmailOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(param: ForgotPasswordByEmailInput, usecaseOption: UsecaseOption): Promise<ForgotPasswordByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth)
            throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        const user = await this._userRepository.get(auth.userId);
        if (!user)
            throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
        if (user.status !== UserStatus.Actived)
            throw new LogicalError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });

        const forgotKey = randomBytes(32).toString('hex');
        const forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const data = new Auth();
        data.forgotKey = forgotKey;
        data.forgotExpire = forgotExpire;

        return await this._dbContext.runTransaction(async querySession => {
            const hasSucceed = await this._authRepository.update(auth.id, data, querySession);
            this._rabbitMQService.publishAuthEventForgotPassword({
                name: user.firstName,
                email: user.email,
                forgotKey
            }, usecaseOption);

            const result = new ForgotPasswordByEmailOutput();
            result.data = hasSucceed;
            return result;
        });
    }
}
