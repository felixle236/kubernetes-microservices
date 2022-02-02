import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { IsArray, IsDateString, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class FindMessageData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsDateString()
    updatedAt: Date;

    @IsUUID()
    channelId: string;

    @IsUUID()
    senderId: string;

    @IsUUID()
    receiverId: string;

    @IsString()
    content: string;
}

export class FindMessageOutput extends DataResponse<FindMessageData[]> {
    @IsArray()
    @RefSchemaArray(FindMessageData)
    data: FindMessageData[];
}
