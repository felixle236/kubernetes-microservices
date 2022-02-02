import { AuthType } from 'domain/enums/AuthType';
import { INTERNAL_API_PRIVATE_KEY } from 'config/Configuration';
import { NextFunction, Request } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { HttpHeaderKey } from 'shared/types/Common';

@Middleware({ type: 'before', priority: 3 })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, _res: Response, next: NextFunction): void {
        if (req.method !== 'OPTIONS') {
            if (req.headers[HttpHeaderKey.PrivateKey] !== INTERNAL_API_PRIVATE_KEY)
                throw new AccessDeniedError();

            if (req.headers[HttpHeaderKey.UserId] && req.headers[HttpHeaderKey.RoleId] && req.headers[HttpHeaderKey.AuthType])
                req.userAuth = new UserAuthenticated(req.headers[HttpHeaderKey.UserId] as string, req.headers[HttpHeaderKey.RoleId] as string, req.headers[HttpHeaderKey.AuthType] as AuthType);
        }
        next();
    }
}
