import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { NotificationType } from 'domain/enums/NotificationType';
import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class FindNotificationData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

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
    title: string;

    @IsString()
    content: string;

    @IsString()
    contentSpec: string;
}

export class FindNotificationOutput extends DataResponse<FindNotificationData[]> {
    @IsArray()
    @RefSchemaArray(FindNotificationData)
    data: FindNotificationData[];
}
