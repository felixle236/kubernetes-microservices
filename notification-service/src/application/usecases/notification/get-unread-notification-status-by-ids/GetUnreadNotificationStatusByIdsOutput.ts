import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsBoolean, IsObject } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetUnreadNotificationStatusByIdsData {
    @IsBoolean()
    id: boolean;

    @IsBoolean()
    id2: boolean;

    @IsBoolean()
    idN: boolean;
}

export class GetUnreadNotificationStatusByIdsOutput extends DataResponse<GetUnreadNotificationStatusByIdsData> {
    @IsObject()
    @RefSchemaObject(GetUnreadNotificationStatusByIdsData)
    data: GetUnreadNotificationStatusByIdsData;
}
