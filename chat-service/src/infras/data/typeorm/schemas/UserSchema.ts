import { SCHEMA } from '../common/Schema';

export const USER_SCHEMA = {
    TABLE_NAME: 'users',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
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
        // The field name that we're defined into entity to map the entity related.
        CHANNELS: 'channels',
        CHANNEL_USERS: 'channelUsers',
        SEND_MESSAGES: 'sendMessages',
        RECEIVE_MESSAGES: 'receiveMessages'
    }
};
