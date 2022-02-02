import { SCHEMA } from '../common/Schema';

export const MESSAGE_SCHEMA = {
    TABLE_NAME: 'message',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
        CHANNEL_ID: 'channel_id',
        SENDER_ID: 'sender_id',
        RECEIVER_ID: 'receiver_id',
        CONTENT: 'content'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        CHANNEL: 'channel',
        SENDER: 'sender',
        RECEIVER: 'receiver'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity to map the entity related.

    }
};
