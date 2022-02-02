import { UserStatus } from 'domain/enums/UserStatus';
import { IsEnum, IsOptional, IsString } from 'shared/decorators/ValidationDecorator';

export class UpdateUserInput {
    @IsEnum(UserStatus)
    status: UserStatus;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName?: string;
}
