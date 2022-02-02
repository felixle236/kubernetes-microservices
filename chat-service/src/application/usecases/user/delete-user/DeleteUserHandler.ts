import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteUserOutput } from './DeleteUserOutput';

@Service()
export class DeleteUserHandler implements IUsecaseHandler<string, DeleteUserOutput> {
    constructor(
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(id: string): Promise<DeleteUserOutput> {
        const user = await this._userRepository.get(id);
        if (!user)
            throw new NotFoundError();

        const result = new DeleteUserOutput();
        result.data = await this._userRepository.softDelete(id);
        return result;
    }
}
