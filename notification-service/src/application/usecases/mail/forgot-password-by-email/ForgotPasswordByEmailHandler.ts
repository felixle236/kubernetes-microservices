import { IMailService } from 'application/interfaces/services/IMailService';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { ForgotPasswordByEmailInput } from './ForgotPasswordByEmailInput';
import { ForgotPasswordByEmailOutput } from './ForgotPasswordByEmailOutput';

@Service()
export class ForgotPasswordByEmailHandler implements IUsecaseHandler<ForgotPasswordByEmailInput, ForgotPasswordByEmailOutput> {
    constructor(
        @Inject(InjectService.Mail) private readonly _mailService: IMailService
    ) {}

    async handle(param: ForgotPasswordByEmailInput, usecaseOption: UsecaseOption): Promise<ForgotPasswordByEmailOutput> {
        await this._mailService.sendForgotPassword({ name: param.name, email: param.email, forgotKey: param.forgotKey, locale: usecaseOption.locale });

        const result = new ForgotPasswordByEmailOutput();
        result.data = true;
        return result;
    }
}
