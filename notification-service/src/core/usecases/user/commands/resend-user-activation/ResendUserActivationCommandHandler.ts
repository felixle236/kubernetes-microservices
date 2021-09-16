import { IMailService } from '@gateways/services/IMailService';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ResendUserActivationCommandInput } from './ResendUserActivationCommandInput';
import { ResendUserActivationCommandOutput } from './ResendUserActivationCommandOutput';

@Service()
export class ResendUserActivationCommandHandler extends CommandHandler<ResendUserActivationCommandInput, ResendUserActivationCommandOutput> {
    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ResendUserActivationCommandInput, _handleOption: HandleOption): Promise<ResendUserActivationCommandOutput> {
        await validateDataInput(param);

        const name = `${param.firstName} ${param.lastName}`;
        await this._mailService.resendUserActivation(name, param.email, param.activeKey);

        const result = new ResendUserActivationCommandOutput();
        result.setData(true);
        return result;
    }
}
