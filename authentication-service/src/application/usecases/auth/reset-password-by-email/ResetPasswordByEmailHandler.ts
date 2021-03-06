import { Auth } from 'domain/entities/Auth';
import { IAuthRepository } from 'application/interfaces/repositories/IAuthRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { ResetPasswordByEmailInput } from './ResetPasswordByEmailInput';
import { ResetPasswordByEmailOutput } from './ResetPasswordByEmailOutput';

@Service()
export class ResetPasswordByEmailHandler implements IUsecaseHandler<ResetPasswordByEmailInput, ResetPasswordByEmailOutput> {
    constructor(
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository
    ) {}

    async handle(param: ResetPasswordByEmailInput): Promise<ResetPasswordByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth)
            throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        if (auth.forgotKey !== param.forgotKey)
            throw new LogicalError(MessageError.PARAM_INCORRECT, { t: 'forgot_key' });

        if (!auth.forgotExpire || auth.forgotExpire < new Date())
            throw new LogicalError(MessageError.PARAM_EXPIRED, { t: 'forgot_key' });

        const data = new Auth();
        Auth.validatePassword(param.password);
        data.password = Auth.hashPassword(param.password);
        data.forgotKey = '';
        data.forgotExpire = undefined;

        const result = new ResetPasswordByEmailOutput();
        result.data = await this._authRepository.update(auth.id, data);
        return result;
    }
}
