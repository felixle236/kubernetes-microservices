import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserCommandInput {
    @IsUUID()
    id: string;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string | null;
}
