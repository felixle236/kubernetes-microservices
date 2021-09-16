import { Chat } from '@domain/entities/chat/Chat';
import { IChatRepository } from '@gateways/repositories/chat/IChatRepository';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { ChatNS } from '@shared/socket/namespaces/ChatNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { Inject, Service } from 'typedi';
import { UpdateChatCommandInput } from './UpdateChatCommandInput';
import { UpdateChatCommandOutput } from './UpdateChatCommandOutput';
import { UpdateChatSocketOutput } from './UpdateChatSocketOutput';

@Service()
export class UpdateChatCommandHandler implements CommandHandler<UpdateChatCommandInput, UpdateChatCommandOutput> {
    @Inject('chat.repository')
    private readonly _chatRepository: IChatRepository;

    @Inject('socket_emitter.service')
    private readonly _socketEmitterService: ISocketEmitterService;

    async handle(id: string, param: UpdateChatCommandInput, handleOption: HandleOption): Promise<UpdateChatCommandOutput> {
        const data = new Chat();
        data.content = param.content;

        const chat = await this._chatRepository.getById(id);
        if (!chat)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'chat');

        if (chat.senderId !== handleOption.userAuth?.userId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._chatRepository.update(id, data);
        chat.content = data.content;
        const socketData = new UpdateChatSocketOutput(chat);
        this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.MESSAGE_UPDATE, chat.receiverId, socketData);

        const result = new UpdateChatCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
