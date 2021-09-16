import { UserStatus } from '@domain/enums/user/UserStatus';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ValidateForgotKeyForEmailCommandInput } from './ValidateForgotKeyForEmailCommandInput';
import { ValidateForgotKeyForEmailCommandOutput } from './ValidateForgotKeyForEmailCommandOutput';

@Service()
export class ValidateForgotKeyForEmailCommandHandler extends CommandHandler<ValidateForgotKeyForEmailCommandInput, ValidateForgotKeyForEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: ValidateForgotKeyForEmailCommandInput): Promise<ValidateForgotKeyForEmailCommandOutput> {
        await validateDataInput(param);

        let isValid = true;
        const auth = await this._authRepository.getByUsername(param.email);

        if (!auth || !auth.user || auth.user.status !== UserStatus.Actived || auth.forgotKey !== param.forgotKey || !auth.forgotExpire || auth.forgotExpire < new Date())
            isValid = false;

        const result = new ValidateForgotKeyForEmailCommandOutput();
        result.setData(isValid);
        return result;
    }
}
