import { IsEmail, IsString } from 'shared/decorators/ValidationDecorator';

export class SendActivationInput {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    activeKey: string;
}
