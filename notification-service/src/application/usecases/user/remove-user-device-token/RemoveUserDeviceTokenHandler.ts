import { User } from 'domain/entities/User';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { RemoveUserDeviceTokenInput } from './RemoveUserDeviceTokenInput';
import { RemoveUserDeviceTokenOutput } from './RemoveUserDeviceTokenOutput';

@Service()
export class RemoveUserDeviceTokenHandler implements IUsecaseHandler<RemoveUserDeviceTokenInput, RemoveUserDeviceTokenOutput> {
    constructor(
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(id: string, param: RemoveUserDeviceTokenInput): Promise<RemoveUserDeviceTokenOutput> {
        const user = await this._userRepository.get(id);
        if (!user)
            throw new NotFoundError();

        const data = new User();
        user.devices = (user.devices || []).filter(device => device.deviceToken !== param.deviceToken && device.deviceExpire > new Date());

        const result = new RemoveUserDeviceTokenOutput();
        result.data = await this._userRepository.update(id, data);
        return result;
    }
}
