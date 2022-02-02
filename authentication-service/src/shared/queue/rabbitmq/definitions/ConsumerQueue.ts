import { RABBITMQ_PREFIX, RABBITMQ_EXCHANGE } from 'config/Configuration';

export class ConsumerQueue {
    // The queue name is the same action of this service, format: [env].[this-service-name].queue.[action-name]
    static QUEUES = {
        CREATE_ACCOUNT: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.queue.create-account`,
        UPDATE_ACCOUNT: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.queue.update-account`,
        DELETE_ACCOUNT: `${RABBITMQ_PREFIX}.${RABBITMQ_EXCHANGE}.queue.delete-account`
    };
}
