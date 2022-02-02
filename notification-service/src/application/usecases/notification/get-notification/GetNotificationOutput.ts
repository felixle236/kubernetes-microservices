import { NotificationTarget } from 'domain/enums/NotificationTarget';
import { NotificationTemplate } from 'domain/enums/NotificationTemplate';
import { NotificationType } from 'domain/enums/NotificationType';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetNotificationData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsDateString()
    updatedAt: Date;

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

export class GetNotificationOutput extends DataResponse<GetNotificationData> {
    @IsObject()
    @RefSchemaObject(GetNotificationData)
    data: GetNotificationData;
}
