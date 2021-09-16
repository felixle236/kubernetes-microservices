import { Chat } from '@domain/entities/chat/Chat';

export class DeleteChatSocketOutput {
    id: string;
    channelId: string;

    constructor(data: Chat) {
        this.id = data.id;
        this.channelId = data.channelId;
    }
}
