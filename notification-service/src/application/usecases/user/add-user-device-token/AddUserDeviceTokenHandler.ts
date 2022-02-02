import { User } from 'domain/entities/User';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { AddUserDeviceTokenInput } from './AddUserDeviceTokenInput';
import { AddUserDeviceTokenOutput } from './AddUserDeviceTokenOutput';

@Service()
export class AddUserDeviceTokenHandler implements IUsecaseHandler<AddUserDeviceTokenInput, AddUserDeviceTokenOutput> {
    constructor(
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(id: string, param: AddUserDeviceTokenInput): Promise<AddUserDeviceTokenOutput> {
        const user = await this._userRepository.get(id);
        if (!user)
            throw new NotFoundError();

        const data = new User();
        user.devices = (user.devices || []).filter(device => device.deviceExpire > new Date());

        const device = user.devices.find(device => device.deviceToken === param.deviceToken);
        if (device)
            device.deviceExpire = param.deviceExpire;
        else
            user.devices.push({ deviceToken: param.deviceToken, deviceExpire: param.deviceExpire });

        const result = new AddUserDeviceTokenOutput();
        result.data = await this._userRepository.update(id, data);
        return result;
    }
}
