import { IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class RemoveUnreadNotificationStatusOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;
}
