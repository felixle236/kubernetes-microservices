import { IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateUserOutput extends DataResponse<string> {
    @IsUUID()
    data: string;
}
