import { INotificationStatusRepository } from '@gateways/repositories/notification/INotificationStatusRepository';
import { IRedisContext } from '@shared/database/interfaces/IRedisContext';
import { Inject, Service } from 'typedi';

@Service('notification_status.repository')
export class NotificationStatusRepository implements INotificationStatusRepository {
    @Inject('redis.context')
    private readonly _redisContext: IRedisContext;

    private readonly _newNotificationStatusKey = 'new_notification_status';

    async getNewNotificationStatusById(id: string): Promise<number> {
        const data = await this._redisContext.redisClient.hgetAsync(this._newNotificationStatusKey, id);
        return data && !isNaN(parseInt(data)) ? parseInt(data) : 0;
    }

    async updateNewNotificationStatus(id: string): Promise<number | null> {
        const data = await this._redisContext.redisClient.hgetAsync(this._newNotificationStatusKey, id);
        const count = data && !isNaN(parseInt(data)) ? parseInt(data) + 1 : 1;
        const result = await this._redisContext.redisClient.hsetAsync(this._newNotificationStatusKey, id, count.toString());
        return result > 0 ? count : null;
    }

    async removeNewNotificationStatus(id: string): Promise<boolean> {
        const result = await this._redisContext.redisClient.hdelAsync(this._newNotificationStatusKey, id);
        return result > 0;
    }
}
