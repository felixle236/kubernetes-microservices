import { ENVIRONMENT } from '@configs/Configuration';
import { Environment } from '@configs/Enums';
import { IAuthenticationService } from '@gateways/services/IAuthenticationService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { IRequest } from '@shared/request/IRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class ApiAuthenticator {
    static authorizationChecker = async (action: Action): Promise<boolean> => {
        const reqExt = action.request as IRequest;

        if (ENVIRONMENT === Environment.Local) {
            if (!reqExt.headers.authorization)
                throw new UnauthorizedError();

            const parts = (reqExt.headers.authorization as string || '').split(' ');
            const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
            if (!token)
                throw new UnauthorizedError();

            const handleOption = new HandleOption();
            handleOption.trace = reqExt.trace;

            const authenticationService: IAuthenticationService = Container.get('authentication.service');
            const data = await authenticationService.verifyUserAuth(token, handleOption);
            reqExt.headers['x-user-id'] = data.userId;
            reqExt.headers['x-role-id'] = data.roleId;
        }

        if (!reqExt.headers['x-user-id'] || !reqExt.headers['x-role-id'])
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'authentication');

        reqExt.userAuth = new UserAuthenticated(reqExt.headers['x-user-id'] as string, reqExt.headers['x-role-id'] as string);
        return true;
    }

    static currentUserChecker = (action: Action): UserAuthenticated | null => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    }
}
