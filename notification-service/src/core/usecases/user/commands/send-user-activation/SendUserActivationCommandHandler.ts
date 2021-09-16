import { IMailService } from '@gateways/services/IMailService';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { SendUserActivationCommandInput } from './SendUserActivationCommandInput';
import { SendUserActivationCommandOutput } from './SendUserActivationCommandOutput';

@Service()
export class SendUserActivationCommandHandler extends CommandHandler<SendUserActivationCommandInput, SendUserActivationCommandOutput> {
    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: SendUserActivationCommandInput, _handleOption: HandleOption): Promise<SendUserActivationCommandOutput> {
        await validateDataInput(param);

        const name = `${param.firstName} ${param.lastName}`;
        await this._mailService.sendUserActivation(name, param.email, param.activeKey);

        const result = new SendUserActivationCommandOutput();
        result.setData(true);
        return result;
    }
}
