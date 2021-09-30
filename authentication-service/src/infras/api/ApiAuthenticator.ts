import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { IRequest } from '@shared/request/IRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class ApiAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const reqExt = action.request as IRequest;
        const handleOption = new HandleOption();
        handleOption.req = reqExt;
        handleOption.trace = reqExt.trace;

        const getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
        const { data } = await getUserAuthByJwtQueryHandler.handle(handleOption);
        if (roleIds && roleIds.length && !roleIds.some(roleId => data && roleId === data.roleId))
            throw new AccessDeniedError();

        reqExt.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    static currentUserChecker = (action: Action): UserAuthenticated | null => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    }
}
