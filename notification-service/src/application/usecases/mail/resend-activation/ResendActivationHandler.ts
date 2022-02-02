import { IMailService } from 'application/interfaces/services/IMailService';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { ResendActivationInput } from './ResendActivationInput';
import { ResendActivationOutput } from './ResendActivationOutput';

@Service()
export class ResendActivationHandler implements IUsecaseHandler<ResendActivationInput, ResendActivationOutput> {
    constructor(
        @Inject(InjectService.Mail) private readonly _mailService: IMailService
    ) {}

    async handle(param: ResendActivationInput, usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
        this._mailService.resendUserActivation({ name: param.name, email: param.email, activeKey: param.activeKey, locale: usecaseOption.locale });

        const result = new ResendActivationOutput();
        result.data = true;
        return result;
    }
}
