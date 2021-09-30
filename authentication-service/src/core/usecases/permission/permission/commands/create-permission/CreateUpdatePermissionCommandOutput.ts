import { Permission } from '@domain/entities/permission/Permission';
import { PermissionItemVO } from '@domain/entities/permission/PermissionItemVO';
import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { RefSchemaArray, RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUpdatePermissionItemCommandData {
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

export class CreateUpdatePermissionCommandData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    path: string;

    @IsArray()
    @RefSchemaArray(CreateUpdatePermissionItemCommandData)
    items: CreateUpdatePermissionItemCommandData[];

    constructor(data: Permission) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.path = data.path;
        this.items = data.items.map(item => new CreateUpdatePermissionItemCommandData(item));
    }
}

export class CreateUpdatePermissionCommandOutput extends DataResponse<CreateUpdatePermissionCommandData> {
    @IsObject()
    @RefSchemaObject(CreateUpdatePermissionCommandData)
    data: CreateUpdatePermissionCommandData;

    setData(data: Permission): void {
        this.data = new CreateUpdatePermissionCommandData(data);
    }
}
