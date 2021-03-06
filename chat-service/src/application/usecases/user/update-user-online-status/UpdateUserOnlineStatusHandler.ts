import { IUserOnlineStatusRepository } from 'application/interfaces/repositories/IUserOnlineStatusRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateUserOnlineStatusInput } from './UpdateUserOnlineStatusInput';
import { UpdateUserOnlineStatusOutput } from './UpdateUserOnlineStatusOutput';

@Service()
export class UpdateUserOnlineStatusHandler implements IUsecaseHandler<UpdateUserOnlineStatusInput, UpdateUserOnlineStatusOutput> {
    constructor(
        @Inject(InjectRepository.UserOnlineStatus) private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository
    ) {}

    async handle(id: string, param: UpdateUserOnlineStatusInput): Promise<UpdateUserOnlineStatusOutput> {
        const onlineStatus = {
            isOnline: param.isOnline,
            onlineAt: param.onlineAt
        };
        const result = new UpdateUserOnlineStatusOutput();
        result.data = await this._userOnlineStatusRepository.updateUserOnlineStatus(id, JSON.stringify(onlineStatus));
        return result;
    }
}
