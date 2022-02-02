import { SCHEMA } from '../common/Schema';

export const NOTIFICATION_SCHEMA = {
    TABLE_NAME: 'notification',
    COLUMNS: {
        ...SCHEMA.COLUMNS,
        TYPE: 'type',
        TEMPLATE: 'template',
        TARGET: 'target',
        RECEIVER_ID: 'receiver_id',
        TITLE: 'title',
        CONTENT: 'content',
        CONTENT_SPEC: 'content_spec'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity to map the entity related.
        RECEIVER: 'receiver'
    },
    RELATED_MANY: {
        // The field name that we're defined into entity to map the entity related.

    }
};
