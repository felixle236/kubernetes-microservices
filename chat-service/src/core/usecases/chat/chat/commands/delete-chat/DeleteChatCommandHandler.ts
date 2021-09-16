import { IChatRepository } from '@gateways/repositories/chat/IChatRepository';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { ChatNS } from '@shared/socket/namespaces/ChatNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { Inject, Service } from 'typedi';
import { DeleteChatCommandOutput } from './DeleteChatCommandOutput';
import { DeleteChatSocketOutput } from './DeleteChatSocketOutput';

@Service()
export class DeleteChatCommandHandler implements CommandHandler<string, DeleteChatCommandOutput> {
    @Inject('chat.repository')
    private readonly _chatRepository: IChatRepository;

    @Inject('socket_emitter.service')
    private readonly _socketEmitterService: ISocketEmitterService;

    async handle(id: string, handleOption: HandleOption): Promise<DeleteChatCommandOutput> {
        const chat = await this._chatRepository.getById(id);
        if (!chat)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'chat');

        if (chat.senderId !== handleOption.userAuth?.userId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._chatRepository.delete(id);
        const socketData = new DeleteChatSocketOutput(chat);
        this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.MESSAGE_DELETE, chat.receiverId, socketData);

        const result = new DeleteChatCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
