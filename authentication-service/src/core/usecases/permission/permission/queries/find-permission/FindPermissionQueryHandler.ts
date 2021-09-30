import { IPermissionRepository } from '@gateways/repositories/permission/IPermissionRepository';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindPermissionQueryInput } from './FindPermissionQueryInput';
import { FindPermissionQueryOutput } from './FindPermissionQueryOutput';

@Service()
export class FindPermissionQueryHandler implements QueryHandler<FindPermissionQueryInput, FindPermissionQueryOutput> {
    @Inject('permission.repository')
    private readonly _permissionRepository: IPermissionRepository;

    async handle(param: FindPermissionQueryInput): Promise<FindPermissionQueryOutput> {
        const filter = new DbPaginationFilter();
        filter.setPagination(param.skip, param.limit);

        const [permissions, count] = await this._permissionRepository.findAndCount(filter);
        const result = new FindPermissionQueryOutput();
        result.setData(permissions);
        result.setPagination(count, param.skip, param.limit);
        return result;
    }
}
