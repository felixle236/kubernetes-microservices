import { randomUUID } from 'crypto';
import { Channel } from 'domain/entities/Channel';
import { Message } from 'domain/entities/Message';
import { IChannelRepository } from 'application/interfaces/repositories/IChannelRepository';
import { IChannelUserRepository } from 'application/interfaces/repositories/IChannelUserRepository';
import { IMessageRepository } from 'application/interfaces/repositories/IMessageRepository';
import { ISocketEmitterService } from 'application/interfaces/services/ISocketEmitterService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { ChatNS } from 'shared/socket/namespaces/ChatNS';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateMessageInput } from './CreateMessageInput';
import { CreateMessageOutput } from './CreateMessageOutput';
import { CreateMessageSocketOutput } from './CreateMessageSocketOutput';

@Service()
export class CreateMessageHandler implements IUsecaseHandler<CreateMessageInput, CreateMessageOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectService.SocketEmitter) private readonly _socketEmitterService: ISocketEmitterService,
        @Inject(InjectRepository.Channel) private readonly _channelRepository: IChannelRepository,
        @Inject(InjectRepository.ChannelUser) private readonly _channelUserRepository: IChannelUserRepository,
        @Inject(InjectRepository.Message) private readonly _messageRepository: IMessageRepository
    ) {}

    async handle(param: CreateMessageInput, usecaseOption: UsecaseOption): Promise<CreateMessageOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const data = new Message();
        data.id = randomUUID();
        data.createdAt = new Date();
        data.updatedAt = new Date();
        data.channelId = param.channelId;
        data.senderId = usecaseOption.userAuth.userId;
        data.receiverId = param.receiverId;
        data.content = param.content;

        const channel = new Channel();
        channel.lastMessage = data.content;
        channel.lastSenderId = data.senderId;

        const isValid = await this._channelUserRepository.checkChannelAndUsers(data.channelId, data.senderId, data.receiverId);
        if (!isValid)
            throw new LogicalError(MessageError.PARAM_INVALID, 'channel');

        return await this._dbContext.runTransaction(async querySession => {
            const id = await this._messageRepository.create(data, querySession);
            await this._channelRepository.update(data.channelId, channel, querySession);

            const socketData = new CreateMessageSocketOutput();
            socketData.id = data.id;
            socketData.createdAt = data.createdAt;
            socketData.updatedAt = data.updatedAt;
            socketData.channelId = data.channelId;
            socketData.senderId = data.senderId;
            socketData.receiverId = data.receiverId;
            socketData.content = data.content;

            this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.MESSAGE_CREATE, data.receiverId, socketData);

            const result = new CreateMessageOutput();
            result.data = id;
            return result;
        });
    }
}
