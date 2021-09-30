import { IPermissionItemVO } from './IPermissionItemVO';
import { IEntity } from '../base/IEntity';

export interface IPermission extends IEntity<string> {
    path: string;
    items: IPermissionItemVO[];

    /* Relationship */
}
