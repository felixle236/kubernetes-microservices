import { UserStatus } from '@domain/enums/user/UserStatus';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateUserStatusCommandInput {
    @IsUUID()
    id: string;

    @IsEnum(UserStatus)
    status: UserStatus;
}
