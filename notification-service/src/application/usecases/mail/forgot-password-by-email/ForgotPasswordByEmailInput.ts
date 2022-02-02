import { IsEmail, IsString } from 'shared/decorators/ValidationDecorator';

export class ForgotPasswordByEmailInput {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    forgotKey: string;
}
