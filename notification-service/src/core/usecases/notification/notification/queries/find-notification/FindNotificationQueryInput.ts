import { NotificationType } from '@domain/enums/notification/NotificationType';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class FindNotificationQueryInput {
    @IsEnum(NotificationType)
    type: NotificationType;

    @IsUUID()
    receiverId: string;

    @IsNumber()
    @IsOptional()
    skipTime = 0;

    @IsNumber()
    @IsOptional()
    limit = 10;
}
