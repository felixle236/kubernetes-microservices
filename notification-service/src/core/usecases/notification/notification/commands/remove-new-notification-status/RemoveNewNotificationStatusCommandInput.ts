import { IsString } from 'class-validator';

export class RemoveNewNotificationStatusCommandInput {
    @IsString()
    receiverId: string;
}
