import { Chat } from '@domain/entities/chat/Chat';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsString, IsUUID } from 'class-validator';

export class GetChatByIdQueryData {
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

    constructor(data: Chat) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.channelId = data.channelId;
        this.senderId = data.senderId;
        this.receiverId = data.receiverId;
        this.content = data.content;
    }
}

export class GetChatByIdQueryOutput extends DataResponse<GetChatByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetChatByIdQueryData)
    data: GetChatByIdQueryData;

    setData(data: Chat): void {
        this.data = new GetChatByIdQueryData(data);
    }
}
