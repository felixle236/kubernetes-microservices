import { IChannelRepository } from 'application/interfaces/repositories/IChannelRepository';
import { IChannelUserRepository } from 'application/interfaces/repositories/IChannelUserRepository';
import { ISocketEmitterService } from 'application/interfaces/services/ISocketEmitterService';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { ChatNS } from 'shared/socket/namespaces/ChatNS';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { DeleteChannelOutput } from './DeleteChannelOutput';
import { DeleteChannelSocketOutput } from './DeleteChannelSocketOutput';

@Service()
export class DeleteChannelHandler implements IUsecaseHandler<string, DeleteChannelOutput> {
    constructor(
        @Inject(InjectService.SocketEmitter) private readonly _socketEmitterService: ISocketEmitterService,
        @Inject(InjectRepository.Channel) private readonly _channelRepository: IChannelRepository,
        @Inject(InjectRepository.ChannelUser) private readonly _channelUserRepository: IChannelUserRepository
    ) {}

    async handle(id: string, usecaseOption: UsecaseOption): Promise<DeleteChannelOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const channel = await this._channelRepository.get(id);
        if (!channel)
            throw new NotFoundError();

        const result = new DeleteChannelOutput();
        result.data = await this._channelRepository.softDelete(id);

        const socketData = new DeleteChannelSocketOutput();
        socketData.id = id;
        const channelUsers = await this._channelUserRepository.findByChannel(id);
        channelUsers.forEach(channelUser => {
            if (channelUser.userId !== usecaseOption.userAuth?.userId)
                this._socketEmitterService.send(ChatNS.NAME, ChatNS.EVENTS.CHANNEL_DELETE, channelUser.userId, socketData);
        });

        return result;
    }
}
