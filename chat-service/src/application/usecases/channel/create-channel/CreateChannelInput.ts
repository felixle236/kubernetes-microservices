import { IsUUID } from 'shared/decorators/ValidationDecorator';

export class CreateChannelInput {
    @IsUUID()
    receiverId: string;
}
