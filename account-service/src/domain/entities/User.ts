import { Entity } from 'domain/common/Entity';
import { GenderType } from 'domain/enums/GenderType';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';

export class User extends Entity {
    roleId: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;

    /* Relationship */

    /* Handlers */

    static validateAvatarFile(file: Express.Multer.File): void {
        const maxSize = 100 * 1024; // 100KB
        const formats = ['jpeg', 'jpg', 'png', 'gif'];

        const format = file.mimetype.replace('image/', '');
        if (!formats.includes(format))
            throw new LogicalError(MessageError.PARAM_FORMAT_INVALID, { t: 'avatar' }, formats.join(', '));

        if (file.size > maxSize)
            throw new LogicalError(MessageError.PARAM_SIZE_MAX, { t: 'avatar' }, maxSize / 1024, 'KB');
    }
}
