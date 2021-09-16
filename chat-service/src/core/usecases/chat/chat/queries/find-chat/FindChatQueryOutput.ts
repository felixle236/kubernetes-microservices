import { Chat } from '@domain/entities/chat/Chat';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsArray, IsDateString, IsString, IsUUID } from 'class-validator';

export class FindChatQueryData {
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

export class FindChatQueryOutput extends DataResponse<FindChatQueryData[]> {
    @IsArray()
    @RefSchemaArray(FindChatQueryData)
    data: FindChatQueryData[];

    setData(list: Chat[]): void {
        this.data = list.map(item => new FindChatQueryData(item));
    }
}
