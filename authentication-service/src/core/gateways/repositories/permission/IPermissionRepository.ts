import { Permission } from '@domain/entities/permission/Permission';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export interface IPermissionRepository extends IBaseRepository<string, Permission> {
    getAllWithCaching(): Promise<Permission[]>;
    getAllWithCaching(expireTimeCaching: number): Promise<Permission[]>;

    getByPath(path: string): Promise<Permission | null>;

    clearCachingByPath(): Promise<void>;
}
