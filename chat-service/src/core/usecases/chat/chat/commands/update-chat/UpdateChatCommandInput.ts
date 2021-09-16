import { IsString } from 'class-validator';

export class UpdateChatCommandInput {
    @IsString()
    content: string;
}
