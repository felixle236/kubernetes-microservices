import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserAvatarCommandInput {
    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    avatar: string | null;
}
