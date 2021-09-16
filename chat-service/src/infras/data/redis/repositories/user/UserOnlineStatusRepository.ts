import { IUserOnlineStatusRepository, OnlineStatus, UserOnlineStatus } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { IRedisContext } from '@shared/database/interfaces/IRedisContext';
import { Inject, Service } from 'typedi';

@Service('user_online_status.repository')
export class UserOnlineStatusRepository implements IUserOnlineStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: IRedisContext;

    private readonly _onlineStatusKey = 'user_online_status';

    async getListOnlineStatusByIds(ids: string[]): Promise<UserOnlineStatus[]> {
        const list = await this._redisContext.redisClient.hmgetAsync(this._onlineStatusKey, ids);
        return ids.map((id, index) => {
            const data = list.length > index && list[index] ? JSON.parse(list[index]) : null;
            if (data)
                return new UserOnlineStatus(id, new OnlineStatus(data.isOnline, data.onlineAt));
            return new UserOnlineStatus(id, new OnlineStatus(false, new Date()));
        });
    }

    async updateUserOnlineStatus(id: string, data: OnlineStatus): Promise<boolean> {
        const result = await this._redisContext.redisClient.hsetAsync(this._onlineStatusKey, id, JSON.stringify(data));
        return result > 0;
    }

    async demoAddKeyWithExpireTime(id: string, data: string, expireSecond: number = 24 * 60 * 60): Promise<boolean> {
        const result = await this._redisContext.redisClient.setAsync(id, data, 'EX', expireSecond);
        return result === 'OK';
    }
}
