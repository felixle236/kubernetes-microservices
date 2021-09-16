import { BASE_SCHEMA } from '../base/BaseSchema';

export const CHAT_CHANNEL_SCHEMA = {
    TABLE_NAME: 'chat_channel',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        LAST_MESSAGE: 'last_message',
        LAST_SENDER_ID: 'last_sender_id'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        LAST_SENDER: 'lastSender'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.
        CHANNEL_USER: 'channelUsers',
        CHAT: 'chats'
    }
};
