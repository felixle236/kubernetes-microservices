import { IsString, IsUUID } from 'class-validator';

export class CreateChatCommandInput {
    @IsUUID()
    channelId: string;

    @IsUUID()
    receiverId: string;

    @IsString()
    content: string;
}
