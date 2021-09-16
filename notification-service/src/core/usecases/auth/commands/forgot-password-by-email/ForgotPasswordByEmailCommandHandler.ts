import { IMailService } from '@gateways/services/IMailService';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ForgotPasswordByEmailCommandInput } from './ForgotPasswordByEmailCommandInput';
import { ForgotPasswordByEmailCommandOutput } from './ForgotPasswordByEmailCommandOutput';

@Service()
export class ForgotPasswordByEmailCommandHandler extends CommandHandler<ForgotPasswordByEmailCommandInput, ForgotPasswordByEmailCommandOutput> {
    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ForgotPasswordByEmailCommandInput, _handleOption: HandleOption): Promise<ForgotPasswordByEmailCommandOutput> {
        await validateDataInput(param);

        const name = `${param.firstName} ${param.lastName}`;
        await this._mailService.sendForgotPassword(name, param.email, param.forgotKey);

        const result = new ForgotPasswordByEmailCommandOutput();
        result.setData(true);
        return result;
    }
}
