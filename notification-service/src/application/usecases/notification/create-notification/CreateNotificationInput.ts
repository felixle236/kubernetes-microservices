import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { NotificationType } from 'domain/enums/NotificationType';
import { IsString, MaxLength, IsEnum, IsUUID, IsOptional, IsBoolean } from 'shared/decorators/ValidationDecorator';

export class CreateNotificationInput {
    @IsEnum(NotificationType)
    type: NotificationType;

    @IsEnum(NotificationTemplate)
    template: NotificationTemplate;

    @IsEnum(NotificationTarget)
    target: NotificationTarget;

    @IsUUID()
    @IsOptional()
    receiverId?: string;

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

    @IsBoolean()
    @IsOptional()
    pushNow = false;
}
