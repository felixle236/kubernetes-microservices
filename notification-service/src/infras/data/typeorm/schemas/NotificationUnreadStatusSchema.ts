import { SCHEMA } from '../common/Schema';

export const NOTIFICATION_UNREAD_STATUS_SCHEMA = {
    TABLE_NAME: 'notification_unread_status',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
        USER_ID: 'user_id',
        NOTIFICATION_IDS: 'notification_ids'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        USER: 'user'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity to map the entity related.

    }
};
