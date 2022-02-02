import { UserStatus } from 'domain/enums/UserStatus';
import { IAuthRepository } from 'application/interfaces/repositories/IAuthRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { ValidateForgotKeyForEmailInput } from './ValidateForgotKeyForEmailInput';
import { ValidateForgotKeyForEmailOutput } from './ValidateForgotKeyForEmailOutput';

@Service()
export class ValidateForgotKeyForEmailHandler implements IUsecaseHandler<ValidateForgotKeyForEmailInput, ValidateForgotKeyForEmailOutput> {
    constructor(
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(param: ValidateForgotKeyForEmailInput): Promise<ValidateForgotKeyForEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        const result = new ValidateForgotKeyForEmailOutput();
        result.data = false;

        if (!auth || auth.forgotKey !== param.forgotKey || !auth.forgotExpire || auth.forgotExpire < new Date())
            return result;

        const user = await this._userRepository.get(auth.userId);
        if (!user || user.status !== UserStatus.Actived)
            return result;

        result.data = true;
        return result;
    }
}
