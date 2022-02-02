import { Auth } from 'domain/entities/Auth';
import { UserStatus } from 'domain/enums/UserStatus';
import { IAuthRepository } from 'application/interfaces/repositories/IAuthRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { LoginByEmailInput } from './LoginByEmailInput';
import { LoginByEmailOutput } from './LoginByEmailOutput';

@Service()
export class LoginByEmailHandler implements IUsecaseHandler<LoginByEmailInput, LoginByEmailOutput> {
    constructor(
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository,
        @Inject(InjectService.AuthJwt) private readonly _authJwtService: IAuthJwtService
    ) {}

    async handle(param: LoginByEmailInput): Promise<LoginByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || Auth.hashPassword(param.password) !== auth.password)
            throw new LogicalError(MessageError.PARAM_INCORRECT, { t: 'email_or_password' });

        const user = await this._userRepository.get(auth.userId);
        if (!user)
            throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
        if (user.status !== UserStatus.Actived)
            throw new LogicalError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });

        const result = new LoginByEmailOutput();
        result.data = this._authJwtService.sign(user.id, user.roleId, auth.type);
        return result;
    }
}
