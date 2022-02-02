import { MAIL_PROVIDER } from 'config/Configuration';
import { MailProvider } from 'shared/types/Environment';
import { IMailProvider } from './interfaces/IMailProvider';
import { MailConsoleFactory } from './providers/MailConsoleFactory';
import { MailGunFactory } from './providers/MailGunFactory';

export class MailSender implements IMailProvider {
    private readonly _provider: IMailProvider;

    constructor() {
        switch (MAIL_PROVIDER) {
            case MailProvider.MailGun:
                this._provider = new MailGunFactory();
                break;

            case MailProvider.Console:
            default:
                this._provider = new MailConsoleFactory();
                break;
        }
    }

    send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return this._provider.send(senderName, senderEmail, emails, subject, content);
    }

    sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return this._provider.sendHtml(senderName, senderEmail, emails, subject, htmlContent);
    }
}
