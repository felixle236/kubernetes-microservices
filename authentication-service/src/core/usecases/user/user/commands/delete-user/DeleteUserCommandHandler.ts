import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { DeleteUserCommandInput } from './DeleteUserCommandInput';
import { DeleteUserCommandOutput } from './DeleteUserCommandOutput';

@Service()
export class DeleteUserCommandHandler extends CommandHandler<DeleteUserCommandInput, DeleteUserCommandOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: DeleteUserCommandInput, _handleOption: HandleOption): Promise<DeleteUserCommandOutput> {
        await validateDataInput(param);

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._userRepository.softDelete(param.id);
        const result = new DeleteUserCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
