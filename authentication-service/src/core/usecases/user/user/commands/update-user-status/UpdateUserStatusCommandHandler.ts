import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateUserStatusCommandInput } from './UpdateUserStatusCommandInput';
import { UpdateUserStatusCommandOutput } from './UpdateUserStatusCommandOutput';

@Service()
export class UpdateUserStatusCommandHandler extends CommandHandler<UpdateUserStatusCommandInput, UpdateUserStatusCommandOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateUserStatusCommandInput, _handleOption: HandleOption): Promise<UpdateUserStatusCommandOutput> {
        await validateDataInput(param);

        const data = new User();
        data.status = param.status;

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._userRepository.update(param.id, data);
        const result = new UpdateUserStatusCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
