import { Chat } from '@domain/entities/chat/Chat';
import { ChatChannel } from '@domain/entities/chat/ChatChannel';
import { IChat } from '@domain/interfaces/chat/IChat';
import { IChatChannelRepository } from '@gateways/repositories/chat/IChatChannelRepository';
import { IChatChannelUserRepository } from '@gateways/repositories/chat/IChatChannelUserRepository';
import { IChatRepository } from '@gateways/repositories/chat/IChatRepository';
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
import { CreateChatCommandInput } from './CreateChatCommandInput';
import { CreateChatCommandOutput } from './CreateChatCommandOutput';
import { CreateChatSocketOutput } from './CreateChatSocketOutput';

@Service()
export class CreateChatCommandHandler implements CommandHandler<CreateChatCommandInput, CreateChatCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('chat.repository')
    private readonly _chatRepository: IChatRepository;

    @Inject('chat_channel.repository')
    private readonly _chatChannelRepository: IChatChannelRepository;

    @Inject('chat_channel_user.repository')
    private readonly _chatChannelUserRepository: IChatChannelUserRepository;

    @Inject('socket_emitter.service')
    private readonly _socketEmitterService: ISocketEmitterService;

    async handle(param: CreateChatCommandInput, handleOption: HandleOption): Promise<CreateChatCommandOutput> {
        await validateDataInput(param);

        if (!handleOption.userAuth)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const data = new Chat({
            id: v4(),
            createdAt: new Date(),
            updatedAt: new Date()
        } as IChat);
        data.channelId = param.channelId;
        data.senderId = handleOption.userAuth.userId;
        data.receiverId = param.receiverId;
        data.content = param.content;

        const channel = new ChatChannel();
        channel.lastMessage = data.content;
        channel.lastSenderId = data.senderId;

        const isValid = await this._chatChannelUserRepository.checkChannelAndUsers(data.channelId, data.senderId, data.receiverId);
        if (!isValid)
            throw new SystemError(MessageError.PARAM_INVALID, 'channel');

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const id = await this._chatRepository.create(data, queryRunner);
            await this._chatChannelRepository.update(data.channelId, channel, queryRunner);
            await this._chatChannelUserRepository.updateTimeByChannel(data.channelId, new Date(), queryRunner);

            const socketData = new CreateChatSocketOutput(data);
            this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.MESSAGE_CREATE, data.receiverId, socketData);

            const result = new CreateChatCommandOutput();
            result.setData(id);
            return result;
        });
    }
}
