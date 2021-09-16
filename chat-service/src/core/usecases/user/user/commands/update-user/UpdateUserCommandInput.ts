import { UserStatus } from '@domain/enums/user/UserStatus';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserCommandInput {
    @IsUUID()
    id: string;

    @IsEnum(UserStatus)
    status: UserStatus;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string | null;
}
