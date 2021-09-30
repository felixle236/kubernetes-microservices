import { BASE_SCHEMA } from '../base/BaseSchema';

export const PERMISSION_SCHEMA = {
    TABLE_NAME: 'permission',
    COLUMNS: {
        ...BASE_SCHEMA.COLUMNS,
        ID: 'id',
        PATH: 'path',
        ITEMS: 'items'
    },
    RELATED_ONE: {
        // The field name that we're defined into entity.

    },
    RELATED_MANY: {
        // The field name that we're defined into entity.

    }
};
