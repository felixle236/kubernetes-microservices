import { IsOptional, IsString } from 'shared/decorators/ValidationDecorator';
import { PaginationRequest } from 'shared/usecase/PaginationRequest';

export class FindChannelInput extends PaginationRequest {
    @IsString()
    @IsOptional()
    keyword?: string;
}
