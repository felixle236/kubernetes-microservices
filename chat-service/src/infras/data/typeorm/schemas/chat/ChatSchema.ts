import { BASE_SCHEMA } from '../base/BaseSchema';

export const CHAT_SCHEMA = {
    TABLE_NAME: 'chat',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        CHANNEL_ID: 'channel_id',
        SENDER_ID: 'sender_id',
        RECEIVER_ID: 'receiver_id',
        CONTENT: 'content'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        CHANNEL: 'channel',
        SENDER: 'sender',
        RECEIVER: 'receiver'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
