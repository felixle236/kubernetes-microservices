import { IsUUID } from 'class-validator';

export class DeleteUserCommandInput {
    @IsUUID()
    id: string;
}
