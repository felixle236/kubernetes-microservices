import { IsUUID } from 'shared/decorators/ValidationDecorator';

export class AddUnreadNotificationStatusInput {
    @IsUUID()
    userId: string;

    @IsUUID()
    notificationId: string;
}
