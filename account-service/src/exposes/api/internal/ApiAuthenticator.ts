import { Request } from 'express';
import { Action } from 'routing-controllers';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';

export class ApiAuthenticator {
    static currentUserChecker = (action: Action): UserAuthenticated | undefined => {
        const req = action.request as Request;
        return req.userAuth;
    };
}
