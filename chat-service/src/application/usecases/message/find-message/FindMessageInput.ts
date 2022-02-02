import { IsOptional, IsUUID, IsNumber, Min, Max } from 'shared/decorators/ValidationDecorator';

export class FindMessageInput {
    @IsUUID()
    channelId: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    skipTime?: number;

    @IsNumber()
    @Min(1)
    @Max(10)
    @IsOptional()
    limit?: number;
}
