import { IChatChannelUserRepository } from '@gateways/repositories/chat/IChatChannelUserRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { FindChatChannelUserQueryOutput } from './FindChatChannelUserQueryOutput';

@Service()
export class FindChatChannelUserQueryHandler implements QueryHandler<string, FindChatChannelUserQueryOutput> {
    @Inject('chat_channel_user.repository')
    private readonly _chatChannelUserRepository: IChatChannelUserRepository;

    async handle(userId: string): Promise<FindChatChannelUserQueryOutput> {
        const chatChannelUsers = await this._chatChannelUserRepository.getAllByUser(userId);
        const result = new FindChatChannelUserQueryOutput();
        result.setData(chatChannelUsers);
        return result;
    }
}
