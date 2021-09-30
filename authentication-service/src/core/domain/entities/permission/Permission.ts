import { IPermission } from '@domain/interfaces/permission/IPermission';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { PermissionItemVO } from './PermissionItemVO';
import { BaseEntity } from '../base/BaseEntity';

export class Permission extends BaseEntity<string, IPermission> implements IPermission {
    get path(): string {
        return this.data.path;
    }

    set path(val: string) {
        val = val.trim();
        if (val.length > 250)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'path', 250);

        this.data.path = val;
    }

    get items(): PermissionItemVO[] {
        return this.data.items.map(item => new PermissionItemVO(item));
    }

    set items(val: PermissionItemVO[]) {
        this.data.items = val.map(item => item.toData());
    }

    /* Relationship */

    /* Handlers */
}
