import { ChatChannel } from '@domain/entities/chat/ChatChannel';
import { ChatChannelUser } from '@domain/entities/chat/ChatChannelUser';
import { User } from '@domain/entities/user/User';
import { RefSchemaArray, RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsArray, IsDateString, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindChatChannelUserQueryChannelData {
    @IsUUID()
    id: string;

    @IsString()
    @IsOptional()
    lastMessage: string;

    @IsString()
    @IsOptional()
    lastSenderId: string;

    constructor(data: ChatChannel) {
        this.id = data.id;
        if (data.lastMessage)
            this.lastMessage = data.lastMessage;
        if (data.lastSenderId)
            this.lastSenderId = data.lastSenderId;
    }
}

export class FindChatChannelUserQueryUserData {
    @IsUUID()
    id: string;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    constructor(data: User) {
        this.id = data.id;
        this.firstName = data.firstName;
        if (data.lastName)
            this.lastName = data.lastName;
    }
}

export class FindChatChannelUserQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    updatedAt: Date;

    @IsString()
    channelId: string;

    @IsString()
    userId: string;

    @IsObject()
    @RefSchemaObject(FindChatChannelUserQueryChannelData)
    channel: FindChatChannelUserQueryChannelData;

    @IsObject()
    @RefSchemaObject(FindChatChannelUserQueryUserData)
    user: FindChatChannelUserQueryUserData;

    constructor(data: ChatChannelUser) {
        this.id = data.id;
        this.updatedAt = data.updatedAt;
        this.channelId = data.channelId;
        this.userId = data.userId;

        if (data.channel)
            this.channel = new FindChatChannelUserQueryChannelData(data.channel);

        if (data.user)
            this.user = new FindChatChannelUserQueryUserData(data.user);
    }
}

export class FindChatChannelUserQueryOutput extends DataResponse<FindChatChannelUserQueryData[]> {
    @IsArray()
    @RefSchemaArray(FindChatChannelUserQueryData)
    data: FindChatChannelUserQueryData[];

    setData(list: ChatChannelUser[]): void {
        this.data = list.map(item => new FindChatChannelUserQueryData(item));
    }
}
