import { IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateChannelOutput extends DataResponse<string> {
    @IsUUID()
    data: string;
}
