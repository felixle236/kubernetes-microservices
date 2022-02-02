import { IsPositive, IsString, IsFutureDate } from 'shared/decorators/ValidationDecorator';

export class AddUserDeviceTokenInput {
    @IsString()
    deviceToken: string;

    @IsPositive()
    @IsFutureDate()
    deviceExpire: Date;
}
