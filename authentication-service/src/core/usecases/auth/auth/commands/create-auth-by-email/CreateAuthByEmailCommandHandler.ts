import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateAuthByEmailCommandInput } from './CreateAuthByEmailCommandInput';
import { CreateAuthByEmailCommandOutput } from './CreateAuthByEmailCommandOutput';

@Service()
export class CreateAuthByEmailCommandHandler extends CommandHandler<CreateAuthByEmailCommandInput, CreateAuthByEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateAuthByEmailCommandInput, handleOption: HandleOption): Promise<CreateAuthByEmailCommandOutput> {
        await validateDataInput(param);

        const data = new Auth();
        data.type = AuthType.PersonalEmail;
        data.userId = param.userId;
        data.username = param.email;
        data.password = param.password;

        const id = await this._authRepository.create(data, handleOption.queryRunner);
        const result = new CreateAuthByEmailCommandOutput();
        result.setData(id);
        return result;
    }
}
