import { IChatChannelUserRepository } from '@gateways/repositories/chat/IChatChannelUserRepository';
import { FindChatByChannelFilter, IChatRepository } from '@gateways/repositories/chat/IChatRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindChatQueryInput } from './FindChatQueryInput';
import { FindChatQueryOutput } from './FindChatQueryOutput';

@Service()
export class FindChatQueryHandler implements QueryHandler<FindChatQueryInput, FindChatQueryOutput> {
    @Inject('chat.repository')
    private readonly _chatRepository: IChatRepository;

    @Inject('chat_channel_user.repository')
    private readonly _chatChannelUserRepository: IChatChannelUserRepository;

    async handle(param: FindChatQueryInput, handleOption: HandleOption): Promise<FindChatQueryOutput> {
        if (!handleOption.userAuth)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const channelUser = await this._chatChannelUserRepository.getByChannelAndUser(param.channelId, handleOption.userAuth.userId);
        if (!channelUser)
            throw new SystemError(MessageError.PARAM_INVALID, 'channel');

        const filter = new FindChatByChannelFilter();
        filter.channelId = param.channelId;
        filter.limit = param.limit;
        filter.skipDate = new Date(param.skipTime);

        const chats = await this._chatRepository.findByChannel(filter);
        const result = new FindChatQueryOutput();
        result.setData(chats);
        return result;
    }
}
