import { ValueObject } from 'domain/common/ValueObject';

export class UserDevice extends ValueObject {
    deviceToken: string;
    deviceExpire: Date;
}
