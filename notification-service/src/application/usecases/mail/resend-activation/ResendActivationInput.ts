import { IsEmail, IsString } from 'shared/decorators/ValidationDecorator';

export class ResendActivationInput {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    activeKey: string;
}
