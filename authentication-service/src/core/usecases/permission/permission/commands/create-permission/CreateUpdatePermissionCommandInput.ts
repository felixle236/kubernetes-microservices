import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUpdatePermissionCommandInput {
    @IsString()
    path: string;

    @IsEnum(HttpMethod)
    method: HttpMethod;

    @IsBoolean()
    isRequired: boolean;

    @IsArray()
    @IsOptional()
    roleIds: string[] | null = null;
}
