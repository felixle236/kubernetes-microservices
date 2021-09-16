import { SMS_PROVIDER, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '@configs/Configuration';
import { SmsProvider } from '@configs/Enums';
import { ISmsProvider } from './interfaces/ISmsProvider';
import { SmsConsoleFactory } from './providers/SmsConsoleFactory';
import { TwilioFactory } from './providers/TwilioFactory';

export class SmsSender implements ISmsProvider {
    private readonly _provider: ISmsProvider;

    constructor() {
        switch (SMS_PROVIDER) {
        case SmsProvider.Twilio:
            this._provider = new TwilioFactory(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
            break;

        case SmsProvider.Console:
        default:
            this._provider = new SmsConsoleFactory();
            break;
        }
    }

    async send(senderOrPhone: string, phoneNumber: string, content: string): Promise<any> {
        return await this._provider.send(senderOrPhone, phoneNumber, content);
    }
}
