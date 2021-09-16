import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateUserCommandInput } from './UpdateUserCommandInput';
import { UpdateUserCommandOutput } from './UpdateUserCommandOutput';

@Service()
export class UpdateUserCommandHandler extends CommandHandler<UpdateUserCommandInput, UpdateUserCommandOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateUserCommandInput, _handleOption: HandleOption): Promise<UpdateUserCommandOutput> {
        await validateDataInput(param);

        const data = new User();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.status = param.status;

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._userRepository.update(param.id, data);
        const result = new UpdateUserCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
