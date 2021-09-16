import { UserStatus } from '@domain/enums/user/UserStatus';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { LoginByEmailQueryInput } from './LoginByEmailQueryInput';
import { LoginByEmailQueryOutput } from './LoginByEmailQueryOutput';

@Service()
export class LoginByEmailQueryHandler extends CommandHandler<LoginByEmailQueryInput, LoginByEmailQueryOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('auth_jwt.service')
    private readonly _authJwtService: IAuthJwtService;

    async handle(param: LoginByEmailQueryInput): Promise<LoginByEmailQueryOutput> {
        await validateDataInput(param);

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.comparePassword(param.password) || !auth.user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email or password');

        if (auth.user.status !== UserStatus.Actived)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        const token = this._authJwtService.sign(auth.userId, auth.user.roleId, auth.type);
        const result = new LoginByEmailQueryOutput();
        result.setData(token);
        return result;
    }
}
