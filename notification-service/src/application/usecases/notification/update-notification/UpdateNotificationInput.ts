import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { NotificationType } from 'domain/enums/NotificationType';
import { IsEnum, IsOptional, IsString, MaxLength } from 'shared/decorators/ValidationDecorator';

export class UpdateNotificationInput {
    @IsEnum(NotificationType)
    type: NotificationType;

    @IsEnum(NotificationTemplate)
    template: NotificationTemplate;

    @IsString()
    @IsOptional()
    @MaxLength(40)
    title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(80)
    content?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    contentSpec?: string;
}
