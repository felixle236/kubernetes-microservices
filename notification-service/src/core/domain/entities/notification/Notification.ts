import { NotificationTarget } from '@domain/enums/notification/NotificationTarget';
import { NotificationType } from '@domain/enums/notification/NotificationType';
import { INotification } from '@domain/interfaces/notification/INotification';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import * as validator from 'class-validator';
import { BaseEntity } from '../base/BaseEntity';

export class Notification extends BaseEntity<string, INotification> implements INotification {
    get type(): NotificationType {
        return this.data.type;
    }

    set type(val: NotificationType) {
        if (!validator.isEnum(val, NotificationType))
            throw new SystemError(MessageError.PARAM_INVALID, 'type');

        this.data.type = val;
    }

    get target(): NotificationTarget {
        return this.data.target;
    }

    set target(val: NotificationTarget) {
        if (!validator.isEnum(val, NotificationTarget))
            throw new SystemError(MessageError.PARAM_INVALID, 'target');

        this.data.target = val;
    }

    get receiverId(): string | null {
        return this.data.receiverId;
    }

    set receiverId(val: string | null) {
        if (val && !validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'receiver');

        this.data.receiverId = val;
    }

    get isRead(): boolean {
        return this.data.isRead;
    }

    set isRead(val: boolean) {
        this.data.isRead = val;
    }

    get title(): string | null {
        return this.data.title;
    }

    set title(val: string | null) {
        if (val) {
            if (val.length > 60)
                throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'title', 60);
        }
        this.data.title = val;
    }

    get content(): string {
        return this.data.content;
    }

    set content(val: string) {
        val = val.trim();
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'content');

        if (val.length > 250)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'content', 250);

        this.data.content = val;
    }

    get contentHtml(): string {
        return this.data.contentHtml;
    }

    set contentHtml(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'html content');

        if (val.length > 1000)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'html content', 1000);

        this.data.contentHtml = val;
    }

    /* Relationship */

    /* Handlers */
}
