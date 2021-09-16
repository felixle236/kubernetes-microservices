import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateUserAvatarCommandInput } from './UpdateUserAvatarCommandInput';
import { UpdateUserAvatarCommandOutput } from './UpdateUserAvatarCommandOutput';

@Service()
export class UpdateUserAvatarCommandHandler extends CommandHandler<UpdateUserAvatarCommandInput, UpdateUserAvatarCommandOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateUserAvatarCommandInput, _handleOption: HandleOption): Promise<UpdateUserAvatarCommandOutput> {
        await validateDataInput(param);

        const data = new User();
        data.avatar = param.avatar;

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._userRepository.update(param.id, data);
        const result = new UpdateUserAvatarCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
