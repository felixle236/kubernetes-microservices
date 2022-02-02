import { IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateMessageOutput extends DataResponse<string> {
    @IsUUID()
    data: string;
}
