import { IsDateString, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class ForgotPasswordByEmailCommandInput {
    @IsUUID()
    id: string;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string | null;

    @IsEmail()
    email: string;

    @IsString()
    forgotKey: string;

    @IsDateString()
    forgotExpire: string;
}
