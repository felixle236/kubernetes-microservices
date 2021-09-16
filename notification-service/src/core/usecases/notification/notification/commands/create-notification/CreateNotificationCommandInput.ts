import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationCommandInput {
    @IsEnum(NotificationTarget)
    target: NotificationTarget;

    @IsUUID()
    @IsOptional()
    receiverId: string | null;

    @IsString()
    @IsOptional()
    title: string | null;

    @IsString()
    content: string;

    @IsString()
    contentHtml: string;
}
