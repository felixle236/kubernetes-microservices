import { DOMAIN, PRODUCT_NAME, PROTOTYPE } from '@configs/Configuration';
import Mailgen from 'mailgen';

export class UserActivationTemplate {
    static getTemplate(name: string, email: string, activeKey: string): Mailgen.Content {
        return {
            body: {
                name,
                intro: `Welcome to ${PRODUCT_NAME}! We're very excited to have you on board.`,
                action: {
                    instructions: `To get started with ${PRODUCT_NAME}, please click here:`,
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: `${PROTOTYPE}://${DOMAIN}/confirm-account?email=${email}&key=${activeKey}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
    }
}
