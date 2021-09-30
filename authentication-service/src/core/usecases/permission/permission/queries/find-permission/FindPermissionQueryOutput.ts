import { Permission } from '@domain/entities/permission/Permission';
import { PermissionItemVO } from '@domain/entities/permission/PermissionItemVO';
import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindPermissionItemQueryData {
    @IsEnum(HttpMethod)
    method: HttpMethod;

    @IsBoolean()
    isRequired: boolean;

    @IsArray()
    @IsOptional()
    roleIds: string[] | null;

    constructor(data: PermissionItemVO) {
        this.method = data.method;
        this.isRequired = data.isRequired;
        this.roleIds = data.roleIds;
    }
}

export class FindPermissionQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    path: string;

    @IsArray()
    @RefSchemaArray(FindPermissionItemQueryData)
    items: FindPermissionItemQueryData[];

    constructor(data: Permission) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.path = data.path;
        this.items = data.items.map(item => new FindPermissionItemQueryData(item));
    }
}

export class FindPermissionQueryOutput extends PaginationResponse<FindPermissionQueryData> {
    @IsArray()
    @RefSchemaArray(FindPermissionQueryData)
    data: FindPermissionQueryData[];

    setData(list: Permission[]): void {
        this.data = list.map(item => new FindPermissionQueryData(item));
    }
}
