import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { IValueObject } from '../base/IValueObject';

export interface IPermissionItemVO extends IValueObject {
    method: HttpMethod;
    isRequired: boolean;
    roleIds: string[] | null;
}
