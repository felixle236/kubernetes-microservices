import { IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateNotificationOutput extends DataResponse<string> {
    @IsUUID()
    data: string;
}
