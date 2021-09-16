import { IChatRepository } from '@gateways/repositories/chat/IChatRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetChatByIdQueryOutput } from './GetChatByIdQueryOutput';

@Service()
export class GetChatByIdQueryHandler implements QueryHandler<string, GetChatByIdQueryOutput> {
    @Inject('chat.repository')
    private readonly _chatRepository: IChatRepository;

    async handle(id: string, handleOption: HandleOption): Promise<GetChatByIdQueryOutput> {
        const chat = await this._chatRepository.getById(id);
        if (!chat)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'chat');

        if (chat.senderId !== handleOption.userAuth?.userId && chat.receiverId !== handleOption.userAuth?.userId)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const result = new GetChatByIdQueryOutput();
        result.setData(chat);
        return result;
    }
}
