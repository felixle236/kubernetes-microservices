import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { validateDataInput } from '@utils/validator';
import { isUUID } from 'class-validator';
import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsQueryInput } from './GetListOnlineStatusByIdsQueryInput';
import { GetListOnlineStatusByIdsQueryData, GetListOnlineStatusByIdsQueryOutput } from './GetListOnlineStatusByIdsQueryOutput';

@Service()
export class GetListOnlineStatusByIdsQueryHandler extends QueryHandler<GetListOnlineStatusByIdsQueryInput, GetListOnlineStatusByIdsQueryOutput> {
    @Inject('user_online_status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(param: GetListOnlineStatusByIdsQueryInput): Promise<GetListOnlineStatusByIdsQueryOutput> {
        await validateDataInput(param);

        if (param.ids.some(id => !isUUID(id)))
            throw new SystemError(MessageError.PARAM_INVALID, 'ids');

        const ids = param.ids ?? [];
        const onlineStatuses = await this._userOnlineStatusRepository.getListOnlineStatusByIds(ids);
        const result = new GetListOnlineStatusByIdsQueryOutput();
        const list: GetListOnlineStatusByIdsQueryData[] = [];

        onlineStatuses.forEach(onlineStatus => {
            const data = new GetListOnlineStatusByIdsQueryData();
            data.id = onlineStatus.id;
            data.isOnline = onlineStatus.status.isOnline;
            data.onlineAt = onlineStatus.status.onlineAt;
            list.push(data);
        });
        result.setData(list);
        return result;
    }
}
