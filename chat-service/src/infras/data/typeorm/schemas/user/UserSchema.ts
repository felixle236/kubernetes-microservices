import { BASE_SCHEMA } from '../base/BaseSchema';

export const USER_SCHEMA = {
    TABLE_NAME: 'users',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ROLE_ID: 'role_id',
        STATUS: 'status',
        FIRST_NAME: 'first_name',
        LAST_NAME: 'last_name',
        EMAIL: 'email',
        AVATAR: 'avatar'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.

    },
    RELATED_MANY: {
        CHAT_CHANNEL_USER: 'chatChannelUsers',
        CHAT_SENDER: 'chatSenders',
        CHAT_RECEIVER: 'chatReceivers'
    }
};
