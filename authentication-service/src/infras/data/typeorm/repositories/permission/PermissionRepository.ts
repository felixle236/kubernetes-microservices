import { Permission } from '@domain/entities/permission/Permission';
import { IPermissionRepository } from '@gateways/repositories/permission/IPermissionRepository';
import { Service } from 'typedi';
import { PermissionDb } from '../../entities/permission/PermissionDb';
import { PERMISSION_SCHEMA } from '../../schemas/permission/PermissionSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('permission.repository')
export class PermissionRepository extends BaseRepository<string, Permission, PermissionDb> implements IPermissionRepository {
    private readonly _permissionCachingKey = 'permission';

    constructor() {
        super(PermissionDb, PERMISSION_SCHEMA);
    }

    async getAllWithCaching(expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Permission[]> {
        const query = this.repository.createQueryBuilder(PERMISSION_SCHEMA.TABLE_NAME)
            .cache(this._permissionCachingKey, expireTimeCaching);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }

    async getByPath(path: string): Promise<Permission | null> {
        const query = this.repository.createQueryBuilder(PERMISSION_SCHEMA.TABLE_NAME)
            .where(`${PERMISSION_SCHEMA.TABLE_NAME}.${PERMISSION_SCHEMA.COLUMNS.PATH} = :path`, { path });

        const result = await query.getOne();
        return result ? result.toEntity() : null;
    }

    async clearCachingByPath(): Promise<void> {
        await this.dbContext.getConnection().clearCaching(this._permissionCachingKey);
    }
}
