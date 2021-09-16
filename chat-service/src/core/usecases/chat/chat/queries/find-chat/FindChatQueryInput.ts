import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class FindChatQueryInput {
    @IsUUID()
    channelId: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    skipTime = new Date().getTime();

    @IsNumber()
    @Min(1)
    @Max(10)
    @IsOptional()
    limit = 10;
}
