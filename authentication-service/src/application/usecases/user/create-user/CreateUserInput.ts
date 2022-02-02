import { UserStatus } from 'domain/enums/UserStatus';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';

export class CreateUserInput {
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
    lastName?: string;

    @IsEmail()
    email: string;
}
