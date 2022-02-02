import { IsArray } from 'shared/decorators/ValidationDecorator';

export class GetUnreadNotificationStatusByIdsInput {
    @IsArray()
    ids: string[];
}
