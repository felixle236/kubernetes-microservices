import { Chat } from '@domain/entities/chat/Chat';

export class CreateChatSocketOutput {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    channelId: string;
    senderId: string;
    receiverId: string;
    content: string;

    constructor(data: Chat) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.channelId = data.channelId;
        this.senderId = data.senderId;
        this.receiverId = data.receiverId;
        this.content = data.content;
    }
}
