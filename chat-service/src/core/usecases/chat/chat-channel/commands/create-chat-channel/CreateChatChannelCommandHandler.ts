import { ChatChannel } from '@domain/entities/chat/ChatChannel';
import { ChatChannelUser } from '@domain/entities/chat/ChatChannelUser';
import { ChatChannelUserStatus } from '@domain/enums/chat/ChatChannelUserStatus';
import { IChatChannel } from '@domain/interfaces/chat/IChatChannel';
import { IChatChannelRepository } from '@gateways/repositories/chat/IChatChannelRepository';
import { IChatChannelUserRepository } from '@gateways/repositories/chat/IChatChannelUserRepository';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { ISocketEmitterService } from '@gateways/services/ISocketEmitterService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { ChatNS } from '@shared/socket/namespaces/ChatNS';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateChatChannelCommandInput } from './CreateChatChannelCommandInput';
import { CreateChatChannelCommandOutput } from './CreateChatChannelCommandOutput';
import { CreateChatChannelSocketOutput } from './CreateChatChannelSocketOutput';

@Service()
export class CreateChatChannelCommandHandler implements CommandHandler<CreateChatChannelCommandInput, CreateChatChannelCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('chat_channel.repository')
    private readonly _chatChannelRepository: IChatChannelRepository;

    @Inject('chat_channel_user.repository')
    private readonly _chatChannelUserRepository: IChatChannelUserRepository;

    @Inject('socket_emitter.service')
    private readonly _socketEmitterService: ISocketEmitterService;

    async handle(param: CreateChatChannelCommandInput, handleOption: HandleOption): Promise<CreateChatChannelCommandOutput> {
        await validateDataInput(param);

        if (!handleOption.userAuth)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const senderId = handleOption.userAuth.userId;
        const data = new ChatChannel({ id: v4() } as IChatChannel);
        data.lastMessage = 'New conversation!';
        data.lastSenderId = senderId;

        const channelUser = new ChatChannelUser();
        channelUser.channelId = data.id;
        channelUser.userId = senderId;

        const channelUser2 = new ChatChannelUser();
        channelUser2.channelId = data.id;
        channelUser2.userId = param.receiverId;

        const sender = await this._userRepository.getById(senderId);
        if (!sender)
            throw new SystemError(MessageError.PARAM_INVALID, 'sender');

        const receiver = await this._userRepository.getById(param.receiverId);
        if (!receiver)
            throw new SystemError(MessageError.PARAM_INVALID, 'receiver');

        const channelId = await this._chatChannelUserRepository.getChannelIdByUsers(senderId, param.receiverId);
        if (channelId) {
            const channelUser = await this._chatChannelUserRepository.getByChannelAndUser(channelId, senderId);
            if (channelUser && channelUser.status === ChatChannelUserStatus.Archived) {
                channelUser.status = ChatChannelUserStatus.Actived;
                await this._chatChannelUserRepository.update(channelUser.id, channelUser);
            }
            const result = new CreateChatChannelCommandOutput();
            result.setData(channelId);
            return result;
        }

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const channel = await this._chatChannelRepository.createGet(data, queryRunner);
            await this._chatChannelUserRepository.createMultiple([channelUser, channelUser2], queryRunner);

            const socketData = new CreateChatChannelSocketOutput(channel);
            this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.CHANNEL_CREATE, receiver.id, socketData);

            const result = new CreateChatChannelCommandOutput();
            result.setData(channel.id);
            return result;
        });
    }
}
