import { User } from 'domain/entities/User';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { CreateUserInput } from './CreateUserInput';
import { CreateUserOutput } from './CreateUserOutput';

@Service()
export class CreateUserHandler implements IUsecaseHandler<CreateUserInput, CreateUserOutput> {
    constructor(
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(param: CreateUserInput): Promise<CreateUserOutput> {
        const data = new User();
        data.id = param.id;
        data.roleId = param.roleId;
        data.status = param.status;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const user = await this._userRepository.get(data.id);
        if (user)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'user' });

        const isExist = await this._userRepository.checkEmailExist(data.email);
        if (isExist)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        const result = new CreateUserOutput();
        result.data = await this._userRepository.create(data);
        return result;
    }
}
