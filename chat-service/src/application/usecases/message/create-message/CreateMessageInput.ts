import { IsString, IsUUID, MaxLength } from 'shared/decorators/ValidationDecorator';

export class CreateMessageInput {
    @IsUUID()
    channelId: string;

    @IsUUID()
    receiverId: string;

    @IsString()
    @MaxLength(500)
    content: string;
}
