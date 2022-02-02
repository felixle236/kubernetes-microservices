import { Auth } from 'domain/entities/Auth';
import { AuthType } from 'domain/enums/AuthType';
import { IAuthRepository } from 'application/interfaces/repositories/IAuthRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { CreateAuthByEmailInput } from './CreateAuthByEmailInput';
import { CreateAuthByEmailOutput } from './CreateAuthByEmailOutput';

@Service()
export class CreateAuthByEmailHandler implements IUsecaseHandler<CreateAuthByEmailInput, CreateAuthByEmailOutput> {
    constructor(
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository
    ) {}

    async handle(param: CreateAuthByEmailInput): Promise<CreateAuthByEmailOutput> {
        const data = new Auth();
        data.type = AuthType.PersonalEmail;
        data.userId = param.userId;
        data.username = param.email;

        Auth.validatePassword(param.password);
        data.password = Auth.hashPassword(param.password);

        const auths = await this._authRepository.getAllByUser(param.userId);
        if (auths && auths.find(auth => auth.type === AuthType.PersonalEmail))
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'data' });

        const auth = await this._authRepository.getByUsername(data.username);
        if (auth)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        const result = new CreateAuthByEmailOutput();
        result.data = await this._authRepository.create(data);
        return result;
    }
}
