import { IsString } from 'shared/decorators/ValidationDecorator';

export class RemoveUserDeviceTokenInput {
    @IsString()
    deviceToken: string;
}
