import { Message } from 'domain/entities/Message';
import { IMessageRepository } from 'application/interfaces/repositories/IMessageRepository';
import { ISocketEmitterService } from 'application/interfaces/services/ISocketEmitterService';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { ChatNS } from 'shared/socket/namespaces/ChatNS';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { UpdateMessageInput } from './UpdateMessageInput';
import { UpdateMessageOutput } from './UpdateMessageOutput';
import { UpdateMessageSocketOutput } from './UpdateMessageSocketOutput';

@Service()
export class UpdateMessageHandler implements IUsecaseHandler<UpdateMessageInput, UpdateMessageOutput> {
    constructor(
        @Inject(InjectService.SocketEmitter) private readonly _socketEmitterService: ISocketEmitterService,
        @Inject(InjectRepository.Message) private readonly _messageRepository: IMessageRepository
    ) {}

    async handle(id: string, param: UpdateMessageInput, usecaseOption: UsecaseOption): Promise<UpdateMessageOutput> {
        const data = new Message();
        data.content = param.content;

        const message = await this._messageRepository.get(id);
        if (!message)
            throw new NotFoundError();

        if (message.senderId !== usecaseOption.userAuth?.userId)
            throw new AccessDeniedError();

        const hasSucceed = await this._messageRepository.update(id, data);
        const socketData = new UpdateMessageSocketOutput();
        socketData.id = message.id;
        socketData.createdAt = message.createdAt;
        socketData.updatedAt = message.updatedAt;
        socketData.channelId = message.channelId;
        socketData.senderId = message.senderId;
        socketData.receiverId = message.receiverId;
        socketData.content = message.content;

        this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.MESSAGE_UPDATE, message.receiverId, socketData);

        const result = new UpdateMessageOutput();
        result.data = hasSucceed;
        return result;
    }
}
