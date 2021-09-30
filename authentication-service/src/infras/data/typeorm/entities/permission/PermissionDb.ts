import { Permission } from '@domain/entities/permission/Permission';
import { IPermission } from '@domain/interfaces/permission/IPermission';
import { IPermissionItemVO } from '@domain/interfaces/permission/IPermissionItemVO';
import { Column, Entity, Index } from 'typeorm';
import { PERMISSION_SCHEMA } from '../../schemas/permission/PermissionSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(PERMISSION_SCHEMA.TABLE_NAME)
export class PermissionDb extends BaseDbEntity<string, Permission> implements IPermission {
    @Column('varchar', { name: PERMISSION_SCHEMA.COLUMNS.PATH, length: 250 })
    @Index({ unique: true })
    path: string;

    @Column('json', { name: PERMISSION_SCHEMA.COLUMNS.ITEMS })
    items: IPermissionItemVO[];

    /* Relationship */

    /* Handlers */

    toEntity(): Permission {
        return new Permission(this);
    }

    fromEntity(entity: Permission): IPermission {
        return entity.toData();
    }
}
