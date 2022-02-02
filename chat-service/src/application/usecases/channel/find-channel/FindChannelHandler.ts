import { IChannelRepository } from 'application/interfaces/repositories/IChannelRepository';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { FindChannelInput } from './FindChannelInput';
import { FindChannelData, FindChannelOutput, FindChannelUserData } from './FindChannelOutput';

@Service()
export class FindChannelHandler implements IUsecaseHandler<FindChannelInput, FindChannelOutput> {
    constructor(
        @Inject(InjectRepository.Channel) private readonly _channelRepository: IChannelRepository
    ) {}

    async handle(param: FindChannelInput, usecaseOption: UsecaseOption): Promise<FindChannelOutput> {
        if (!usecaseOption.userAuth)
            throw new AccessDeniedError();

        const [channels, count] = await this._channelRepository.findAndCount({
            userId: usecaseOption.userAuth.userId,
            keyword: param.keyword,
            skip: param.skip,
            limit: param.limit
        });

        const result = new FindChannelOutput();
        result.setPagination(count, param.skip, param.limit);
        result.data = channels.map(channel => {
            const data = new FindChannelData();
            data.id = channel.id;
            data.createdAt = channel.createdAt;
            data.updatedAt = channel.updatedAt;
            data.lastMessage = channel.lastMessage;
            data.lastSenderId = channel.lastSenderId;

            if (channel.channelUsers && channel.channelUsers.length) {
                const user = channel.channelUsers[0].user;
                if (user) {
                    data.user = new FindChannelUserData();
                    data.user.id = user.id;
                    data.user.status = user.status;
                    data.user.firstName = user.firstName;
                    data.user.lastName = user.lastName;
                    data.user.email = user.email;
                }
            }
            return data;
        });
        return result;
    }
}
