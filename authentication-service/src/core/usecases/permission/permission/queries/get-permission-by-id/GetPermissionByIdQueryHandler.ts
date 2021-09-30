import { IPermissionRepository } from '@gateways/repositories/permission/IPermissionRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetPermissionByIdQueryOutput } from './GetPermissionByIdQueryOutput';

@Service()
export class GetPermissionByIdQueryHandler implements QueryHandler<string, GetPermissionByIdQueryOutput> {
    @Inject('permission.repository')
    private readonly _permissionRepository: IPermissionRepository;

    async handle(id: string): Promise<GetPermissionByIdQueryOutput> {
        const permission = await this._permissionRepository.getById(id);
        if (!permission)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'permission');

        const result = new GetPermissionByIdQueryOutput();
        result.setData(permission);
        return result;
    }
}
