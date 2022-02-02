import { NotificationType } from 'domain/enums/NotificationType';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'shared/decorators/ValidationDecorator';

export class FindNotificationInput {
    @IsEnum(NotificationType)
    type: NotificationType;

    @IsNumber()
    @Min(0)
    @IsOptional()
    skipDate = new Date().getTime();

    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit = 10;
}
