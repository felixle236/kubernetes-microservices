import { Permission } from '@domain/entities/permission/Permission';
import { PermissionItemVO } from '@domain/entities/permission/PermissionItemVO';
import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { RefSchemaArray, RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetPermissionItemByIdQueryData {
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

export class GetPermissionByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    path: string;

    @IsArray()
    @RefSchemaArray(GetPermissionItemByIdQueryData)
    items: GetPermissionItemByIdQueryData[];

    constructor(data: Permission) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.path = data.path;
        this.items = data.items.map(item => new GetPermissionItemByIdQueryData(item));
    }
}

export class GetPermissionByIdQueryOutput extends DataResponse<GetPermissionByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetPermissionByIdQueryData)
    data: GetPermissionByIdQueryData;

    setData(data: Permission): void {
        this.data = new GetPermissionByIdQueryData(data);
    }
}
