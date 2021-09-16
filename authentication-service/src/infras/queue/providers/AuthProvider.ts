import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { AuthExchange } from '@shared/queue/provide/exchanges/AuthExchange';
import { Inject, Service } from 'typedi';

@Service()
export default class AuthProvider {
    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    async init(): Promise<void> {
        await this._queueContext.provideQueues(AuthExchange.EXCHANGE, AuthExchange.ROUTINGS);
    }
}
