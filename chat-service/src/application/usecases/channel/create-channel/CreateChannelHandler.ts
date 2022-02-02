import { randomUUID } from 'crypto';
import { Channel } from 'domain/entities/Channel';
import { ChannelUser } from 'domain/entities/ChannelUser';
import { IChannelRepository } from 'application/interfaces/repositories/IChannelRepository';
import { IChannelUserRepository } from 'application/interfaces/repositories/IChannelUserRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
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
import { CreateChannelInput } from './CreateChannelInput';
import { CreateChannelOutput } from './CreateChannelOutput';
import { CreateChannelSocketOutput } from './CreateChannelSocketOutput';

@Service()
export class CreateChannelHandler implements IUsecaseHandler<CreateChannelInput, CreateChannelOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository,
        @Inject(InjectService.SocketEmitter) private readonly _socketEmitterService: ISocketEmitterService,
        @Inject(InjectRepository.Channel) private readonly _channelRepository: IChannelRepository,
        @Inject(InjectRepository.ChannelUser) private readonly _channelUserRepository: IChannelUserRepository
    ) {}

    async handle(param: CreateChannelInput, usecaseOption: UsecaseOption): Promise<CreateChannelOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const senderId = usecaseOption.userAuth.userId;
        const data = new Channel();
        data.id = randomUUID();
        data.createdAt = new Date();
        data.updatedAt = new Date();
        data.lastMessage = 'New conversation!';
        data.lastSenderId = senderId;

        const channelSender = new ChannelUser();
        channelSender.channelId = data.id;
        channelSender.userId = senderId;

        const channelReceiver = new ChannelUser();
        channelReceiver.channelId = data.id;
        channelReceiver.userId = param.receiverId;

        const receiver = await this._userRepository.get(param.receiverId);
        if (!receiver)
            throw new LogicalError(MessageError.DATA_INVALID);

        const channelId = await this._channelUserRepository.getChannelIdByUsers(senderId, param.receiverId);
        if (channelId)
            throw new LogicalError(MessageError.PARAM_EXISTED, 'channel');

        return await this._dbContext.runTransaction(async querySession => {
            const id = await this._channelRepository.create(data, querySession);
            await this._channelUserRepository.createMultiple([channelSender, channelReceiver], querySession);

            const socketData = new CreateChannelSocketOutput();
            socketData.id = id;
            socketData.createdAt = data.createdAt;
            socketData.updatedAt = data.updatedAt;
            socketData.lastSenderId = data.lastSenderId;
            socketData.lastMessage = data.lastMessage;

            this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.CHANNEL_CREATE, receiver.id, socketData);

            const result = new CreateChannelOutput();
            result.data = id;
            return result;
        });
    }
}
