import { IsUUID } from 'class-validator';

export class ArchiveChatChannelUserCommandInput {
    @IsUUID()
    channelId: string;
}
