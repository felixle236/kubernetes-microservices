import { Notification } from '@domain/entities/notification/Notification';
import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsBoolean, IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetNotificationByIdQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsEnum(NotificationTarget)
    target: NotificationTarget;

    @IsUUID()
    @IsOptional()
    receiverId: string | null;

    @IsBoolean()
    isRead: boolean;

    @IsString()
    @IsOptional()
    title: string | null;

    @IsString()
    content: string;

    @IsString()
    contentHtml: string;

    constructor(data: Notification) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.type = data.type;
        this.target = data.target;
        this.receiverId = data.receiverId;
        this.isRead = data.isRead;
        this.title = data.title;
        this.content = data.content;
        this.contentHtml = data.contentHtml;
    }
}

export class GetNotificationByIdQueryOutput extends DataResponse<GetNotificationByIdQueryData> {
    @IsObject()
    @RefSchemaObject(GetNotificationByIdQueryData)
    data: GetNotificationByIdQueryData;

    setData(data: Notification): void {
        this.data = new GetNotificationByIdQueryData(data);
    }
}
