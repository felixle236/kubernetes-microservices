import { Notification } from '@domain/entities/notification/Notification';
import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindNotificationQueryData {
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

export class FindNotificationQueryOutput extends DataResponse<FindNotificationQueryData[]> {
    @IsArray()
    @RefSchemaArray(FindNotificationQueryData)
    data: FindNotificationQueryData[];

    setData(list: Notification[]): void {
        this.data = list.map(item => new FindNotificationQueryData(item));
    }
}
