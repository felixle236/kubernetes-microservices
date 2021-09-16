import { BASE_SCHEMA } from '../base/BaseSchema';

export const NOTIFICATION_SCHEMA = {
    TABLE_NAME: 'notification',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        TYPE: 'type',
        TARGET: 'target',
        RECEIVER_ID: 'receiver_id',
        IS_READ: 'is_read',
        TITLE: 'title',
        CONTENT: 'content',
        CONTENT_HTML: 'content_html'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.

    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
