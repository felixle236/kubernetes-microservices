import { IChannelUserRepository } from 'application/interfaces/repositories/IChannelUserRepository';
import { IMessageRepository } from 'application/interfaces/repositories/IMessageRepository';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { FindMessageInput } from './FindMessageInput';
import { FindMessageData, FindMessageOutput } from './FindMessageOutput';

@Service()
export class FindMessageHandler implements IUsecaseHandler<FindMessageInput, FindMessageOutput> {
    constructor(
        @Inject(InjectRepository.ChannelUser) private readonly _channelUserRepository: IChannelUserRepository,
        @Inject(InjectRepository.Message) private readonly _messageRepository: IMessageRepository
    ) {}

    async handle(param: FindMessageInput, usecaseOption: UsecaseOption): Promise<FindMessageOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const channelUser = await this._channelUserRepository.getByChannelAndUser(param.channelId, usecaseOption.userAuth.userId);
        if (!channelUser)
            throw new LogicalError(MessageError.PARAM_INVALID, 'channel');

        const messages = await this._messageRepository.findByChannel({
            channelId: param.channelId,
            skipDate: param.skipTime ? new Date(param.skipTime) : new Date(),
            limit: param.limit || 10
        });

        const result = new FindMessageOutput();
        result.data = messages.map(message => {
            const data = new FindMessageData();
            data.id = message.id;
            data.createdAt = message.createdAt;
            data.updatedAt = message.updatedAt;
            data.channelId = message.channelId;
            data.senderId = message.senderId;
            data.receiverId = message.receiverId;
            data.content = message.content;

            return data;
        });
        return result;
    }
}
