import { Permission } from '@domain/entities/permission/Permission';
import { PermissionItemVO } from '@domain/entities/permission/PermissionItemVO';
import { IPermissionRepository } from '@gateways/repositories/permission/IPermissionRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateUpdatePermissionCommandInput } from './CreateUpdatePermissionCommandInput';
import { CreateUpdatePermissionCommandOutput } from './CreateUpdatePermissionCommandOutput';

@Service()
export class CreateUpdatePermissionCommandHandler implements CommandHandler<CreateUpdatePermissionCommandInput, CreateUpdatePermissionCommandOutput> {
    @Inject('permission.repository')
    private readonly _permissionRepository: IPermissionRepository;

    async handle(param: CreateUpdatePermissionCommandInput): Promise<CreateUpdatePermissionCommandOutput> {
        await validateDataInput(param);

        const data = new Permission();
        data.path = param.path;
        const item = new PermissionItemVO();
        item.method = param.method;
        item.isRequired = param.isRequired;
        item.roleIds = param.roleIds;
        data.items = [item];

        let per: Permission;
        const permission = await this._permissionRepository.getByPath(data.path);
        if (!permission)
            per = await this._permissionRepository.createGet(data);
        else {
            const perItem = permission.items.find(item => item.method);
            if (!perItem)
                permission.items.push(item);
            else {
                perItem.isRequired = item.isRequired;
                perItem.roleIds = item.roleIds;
            }
            per = await this._permissionRepository.updateGet(permission.id, permission) as Permission;
        }
        await this._permissionRepository.clearCachingByPath();

        const result = new CreateUpdatePermissionCommandOutput();
        result.setData(per);
        return result;
    }
}
