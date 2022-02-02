import { SCHEMA } from '../common/Schema';

export const CHANNEL_SCHEMA = {
    TABLE_NAME: 'channel',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
        LAST_MESSAGE: 'last_message',
        LAST_SENDER_ID: 'last_sender_id'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        LAST_SENDER: 'lastSender'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity to map the entity related.
        CHANNEL_USERS: 'channelUsers',
        MESSAGES: 'messages'
    }
};
