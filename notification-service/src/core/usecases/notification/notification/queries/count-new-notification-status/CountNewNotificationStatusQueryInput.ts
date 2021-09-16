import { IsString } from 'class-validator';

export class CountNewNotificationStatusQueryInput {
    @IsString()
    receiverId: string;
}
