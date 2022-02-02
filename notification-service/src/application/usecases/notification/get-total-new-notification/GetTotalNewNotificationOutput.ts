import { IsInt } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetTotalNewNotificationOutput extends DataResponse<number> {
    @IsInt()
    data: number;
}
