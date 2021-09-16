import { IsUUID } from 'class-validator';

export class CreateChatChannelCommandInput {
    @IsUUID()
    receiverId: string;
}
