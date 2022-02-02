import { IsString, MaxLength } from 'shared/decorators/ValidationDecorator';

export class UpdateMessageInput {
    @IsString()
    @MaxLength(500)
    content: string;
}
