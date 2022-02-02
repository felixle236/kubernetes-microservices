import { IMessageRepository } from 'application/interfaces/repositories/IMessageRepository';
import { ISocketEmitterService } from 'application/interfaces/services/ISocketEmitterService';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { ChatNS } from 'shared/socket/namespaces/ChatNS';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { DeleteMessageOutput } from './DeleteMessageOutput';
import { DeleteMessageSocketOutput } from './DeleteMessageSocketOutput';

@Service()
export class DeleteMessageHandler implements IUsecaseHandler<string, DeleteMessageOutput> {
    constructor(
        @Inject(InjectService.SocketEmitter) private readonly _socketEmitterService: ISocketEmitterService,
        @Inject(InjectRepository.Message) private readonly _messageRepository: IMessageRepository
    ) {}

    async handle(id: string, usecaseOption: UsecaseOption): Promise<DeleteMessageOutput> {
        const message = await this._messageRepository.get(id);
        if (!message)
            throw new NotFoundError();

        if (message.senderId !== usecaseOption.userAuth?.userId)
            throw new AccessDeniedError();

        const hasSucceed = await this._messageRepository.delete(id);
        const socketData = new DeleteMessageSocketOutput();
        socketData.id = id;
        socketData.channelId = message.channelId;
        this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.MESSAGE_DELETE, message.receiverId, socketData);

        const result = new DeleteMessageOutput();
        result.data = hasSucceed;
        return result;
    }
}
