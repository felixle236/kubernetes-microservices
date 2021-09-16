import './QueueContext';
import path from 'path';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { getFilesSync } from '@utils/file';
import Container from 'typedi';

export class QueueService {
    static async init(): Promise<void> {
        const queueContext: IQueueContext = Container.get('queue.context');
        await queueContext.createConnection();

        this._initQueues(path.join(__dirname, './providers'));
        this._initQueues(path.join(__dirname, './consumers'));
    }

    private static _initQueues(folder: string): void {
        getFilesSync(folder).forEach(file => {
            if (!file.startsWith('.') && !file.includes('.spec')) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const exchange = require(`${folder}/${file}`).default;
                const exchangeInstance = Container.get(exchange) as any;
                exchangeInstance.init();
            }
        });
    }
}
