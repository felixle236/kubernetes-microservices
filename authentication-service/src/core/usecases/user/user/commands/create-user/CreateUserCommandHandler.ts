import { User } from '@domain/entities/user/User';
import { IUser } from '@domain/interfaces/user/IUser';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateUserCommandInput } from './CreateUserCommandInput';
import { CreateUserCommandOutput } from './CreateUserCommandOutput';

@Service()
export class CreateUserCommandHandler extends CommandHandler<CreateUserCommandInput, CreateUserCommandOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: CreateUserCommandInput, _handleOption: HandleOption): Promise<CreateUserCommandOutput> {
        await validateDataInput(param);

        const data = new User({ id: param.id } as IUser);
        data.roleId = param.roleId;
        data.status = param.status;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        let user = await this._userRepository.getById(data.id);
        if (user)
            throw new SystemError(MessageError.PARAM_EXISTED, 'user');

        user = await this._userRepository.getByEmail(data.email);
        if (user)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const id = await this._userRepository.create(data);
        const result = new CreateUserCommandOutput();
        result.setData(id);
        return result;
    }
}
