import { ChatChannelUserStatus } from '@domain/enums/chat/ChatChannelUserStatus';
import { IChatChannelUserRepository } from '@gateways/repositories/chat/IChatChannelUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ArchiveChatChannelUserCommandInput } from './ArchiveChatChannelUserCommandInput';
import { ArchiveChatChannelUserCommandOutput } from './ArchiveChatChannelUserCommandOutput';

@Service()
export class ArchiveChatChannelUserCommandHandler implements CommandHandler<ArchiveChatChannelUserCommandInput, ArchiveChatChannelUserCommandOutput> {
    @Inject('chat_channel_user.repository')
    private readonly _chatChannelUserRepository: IChatChannelUserRepository;

    async handle(param: ArchiveChatChannelUserCommandInput, handleOption: HandleOption): Promise<ArchiveChatChannelUserCommandOutput> {
        await validateDataInput(param);

        if (!handleOption.userAuth)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const chatChannelUser = await this._chatChannelUserRepository.getByChannelAndUser(param.channelId, handleOption.userAuth.userId);
        if (!chatChannelUser)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'channel');

        if (chatChannelUser.status !== ChatChannelUserStatus.Actived)
            throw new SystemError(MessageError.PARAM_INVALID, 'channel');

        chatChannelUser.status = ChatChannelUserStatus.Archived;
        const hasSucceed = await this._chatChannelUserRepository.update(chatChannelUser.id, chatChannelUser);

        const result = new ArchiveChatChannelUserCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
