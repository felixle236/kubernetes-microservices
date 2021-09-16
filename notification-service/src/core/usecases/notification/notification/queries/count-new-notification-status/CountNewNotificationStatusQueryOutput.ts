import { DataResponse } from '@shared/usecase/DataResponse';
import { IsNumber } from 'class-validator';

export class CountNewNotificationStatusQueryOutput extends DataResponse<number> {
    @IsNumber()
    data: number;

    setData(data: number): void {
        this.data = data;
    }
}
