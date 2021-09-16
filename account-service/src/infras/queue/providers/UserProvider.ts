import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { Inject, Service } from 'typedi';

@Service()
export default class UserProvider {
    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    async init(): Promise<void> {
        await this._queueContext.provideQueues(UserExchange.EXCHANGE, UserExchange.ROUTINGS);
    }
}
