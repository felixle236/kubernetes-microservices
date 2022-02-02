import { User } from 'domain/entities/User';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateUserInput } from './UpdateUserInput';
import { UpdateUserOutput } from './UpdateUserOutput';

@Service()
export class UpdateUserHandler implements IUsecaseHandler<UpdateUserInput, UpdateUserOutput> {
    constructor(
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(id: string, param: UpdateUserInput): Promise<UpdateUserOutput> {
        const data = new User();
        data.status = param.status;
        data.firstName = param.firstName;
        data.lastName = param.lastName;

        const user = await this._userRepository.get(id);
        if (!user)
            throw new NotFoundError();

        const result = new UpdateUserOutput();
        result.data = await this._userRepository.update(id, data);
        return result;
    }
}
