import { UserStatus } from 'domain/enums/UserStatus';
import { RefSchemaArray, RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsArray, IsDateString, IsEmail, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { PaginationResponse } from 'shared/usecase/PaginationResponse';

export class FindChannelUserData {
    @IsUUID()
    id: string;

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

export class FindChannelData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsDateString()
    updatedAt: Date;

    @IsString()
    @IsOptional()
    lastMessage?: string;

    @IsString()
    @IsOptional()
    lastSenderId?: string;

    @IsObject()
    @RefSchemaObject(FindChannelUserData)
    user: FindChannelUserData;
}

export class FindChannelOutput extends PaginationResponse<FindChannelData> {
    @IsArray()
    @RefSchemaArray(FindChannelData)
    data: FindChannelData[];
}
