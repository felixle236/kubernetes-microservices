import { IMailService } from 'application/interfaces/services/IMailService';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { SendActivationInput } from './SendActivationInput';
import { SendActivationOutput } from './SendActivationOutput';

@Service()
export class SendActivationHandler implements IUsecaseHandler<SendActivationInput, SendActivationOutput> {
    constructor(
        @Inject(InjectService.Mail) private readonly _mailService: IMailService
    ) {}

    async handle(param: SendActivationInput, usecaseOption: UsecaseOption): Promise<SendActivationOutput> {
        this._mailService.sendUserActivation({ name: param.name, email: param.email, activeKey: param.activeKey, locale: usecaseOption.locale });

        const result = new SendActivationOutput();
        result.data = true;
        return result;
    }
}
