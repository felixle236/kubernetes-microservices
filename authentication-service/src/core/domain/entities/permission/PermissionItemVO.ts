import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { RoleId } from '@domain/enums/user/RoleId';
import { IPermissionItemVO } from '@domain/interfaces/permission/IPermissionItemVO';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { isEnum, isUUID } from 'class-validator';
import { BaseVO } from '../base/BaseVO';

export class PermissionItemVO extends BaseVO<IPermissionItemVO> implements IPermissionItemVO {
    get method(): HttpMethod {
        return this.data.method;
    }

    set method(val: HttpMethod) {
        if (!validator.isEnum(val, HttpMethod))
            throw new SystemError(MessageError.PARAM_INVALID, 'method');

        this.data.method = val;
    }

    get isRequired(): boolean {
        return this.data.isRequired;
    }

    set isRequired(val: boolean) {
        this.data.isRequired = val;
    }

    set roleIds(val: string[] | null) {
        if (val && val.length) {
            if (val.some(item => !isUUID(item) || !isEnum(item, RoleId)))
                throw new SystemError(MessageError.PARAM_INVALID, 'role');
        }

        this.data.roleIds = val;
    }

    get roleIds(): string[] | null {
        return this.data.roleIds;
    }
}
