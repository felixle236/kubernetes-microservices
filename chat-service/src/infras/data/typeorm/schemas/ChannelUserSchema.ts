import { SCHEMA } from '../common/Schema';

export const CHANNEL_USER_SCHEMA = {
    TABLE_NAME: 'channel_user',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
        USER_ID: 'user_id',
        CHANNEL_ID: 'channel_id'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        USER: 'user',
        CHANNEL: 'channel'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity to map the entity related.

    }
};
