import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationCommandInput {
    @IsString()
    @IsOptional()
    title: string | null;

    @IsString()
    @IsOptional()
    content: string;

    @IsString()
    @IsOptional()
    contentHtml: string;
}
