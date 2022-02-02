import { IAuthenticationService } from 'application/interfaces/services/IAuthenticationService';
import { ENVIRONMENT } from 'config/Configuration';
import { Request } from 'express';
import { Action } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { HttpHeaderKey } from 'shared/types/Common';
import { Environment } from 'shared/types/Environment';
import { InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import Container from 'typedi';

export class ApiAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const req = action.request as Request;

        if (ENVIRONMENT === Environment.Local) {
            if (!req.headers.authorization)
                throw new UnauthorizedError();

            const authenticationService: IAuthenticationService = Container.get(InjectService.Auth);
            const token = authenticationService.getTokenFromHeader(req.headers);
            if (!token)
                throw new UnauthorizedError();

            const usecaseOption = new UsecaseOption();
            usecaseOption.req = req;
            usecaseOption.trace = req.trace;

            const data = await authenticationService.verifyUserAuth(token, usecaseOption);
            req.headers[HttpHeaderKey.UserId] = data.userId;
            req.headers[HttpHeaderKey.RoleId] = data.roleId;
            req.headers[HttpHeaderKey.AuthType] = data.type;
        }

        if (!req.headers[HttpHeaderKey.UserId] || !req.headers[HttpHeaderKey.RoleId] || !req.headers[HttpHeaderKey.AuthType])
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'authentication');

        if (roleIds && roleIds.length && !roleIds.some(roleId => roleId === req.headers[HttpHeaderKey.RoleId]))
            throw new AccessDeniedError();

        req.userAuth = new UserAuthenticated(req.headers[HttpHeaderKey.UserId] as string, req.headers[HttpHeaderKey.RoleId] as string, req.headers[HttpHeaderKey.AuthType] as string);
        return true;
    };

    static currentUserChecker = (action: Action): UserAuthenticated | undefined => {
        const req = action.request as Request;
        return req.userAuth;
    };
}
