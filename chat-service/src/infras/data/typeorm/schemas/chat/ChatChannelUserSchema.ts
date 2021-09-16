import { BASE_SCHEMA } from '../base/BaseSchema';

export const CHAT_CHANNEL_USER_SCHEMA = {
    TABLE_NAME: 'chat_channel_user',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        USER_ID: 'user_id',
        CHANNEL_ID: 'channel_id',
        STATUS: 'status'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.
        USER: 'user',
        CHANNEL: 'channel'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
