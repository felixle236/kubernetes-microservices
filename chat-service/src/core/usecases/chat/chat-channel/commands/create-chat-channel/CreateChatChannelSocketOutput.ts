import { ChatChannel } from '@domain/entities/chat/ChatChannel';

export class CreateChatChannelSocketOutput {
    id: string;
    createdAt: Date;
    lastMessage: string | null;
    lastSenderId: string | null;

    constructor(data: ChatChannel) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.lastMessage = data.lastMessage;
        this.lastSenderId = data.lastSenderId;
    }
}
