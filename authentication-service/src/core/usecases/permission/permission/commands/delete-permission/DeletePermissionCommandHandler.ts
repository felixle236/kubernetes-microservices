import { IPermissionRepository } from '@gateways/repositories/permission/IPermissionRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { DeletePermissionCommandOutput } from './DeletePermissionCommandOutput';

@Service()
export class DeletePermissionCommandHandler implements CommandHandler<string, DeletePermissionCommandOutput> {
    @Inject('permission.repository')
    private readonly _permissionRepository: IPermissionRepository;

    async handle(id: string): Promise<DeletePermissionCommandOutput> {
        const permission = await this._permissionRepository.getById(id);
        if (!permission)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'permission');

        const hasSucceed = await this._permissionRepository.delete(id);
        await this._permissionRepository.clearCachingByPath();

        const result = new DeletePermissionCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
