import { UserStatus } from '@domain/enums/user/UserStatus';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserCommandInput {
    @IsUUID()
    id: string;

    @IsUUID()
    roleId: string;

    @IsEnum(UserStatus)
    status: UserStatus;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string | null;

    @IsEmail()
    email: string;
}
