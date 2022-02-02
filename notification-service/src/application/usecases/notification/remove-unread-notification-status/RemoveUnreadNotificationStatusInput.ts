import { IsUUID } from 'shared/decorators/ValidationDecorator';

export class RemoveUnreadNotificationStatusInput {
    @IsUUID()
    userId: string;

    @IsUUID()
    notificationId: string;
}
