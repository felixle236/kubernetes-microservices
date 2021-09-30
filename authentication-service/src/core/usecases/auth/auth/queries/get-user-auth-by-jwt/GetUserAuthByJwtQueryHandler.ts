import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { ILogService } from '@gateways/services/ILogService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetUserAuthByJwtQueryOutput } from './GetUserAuthByJwtQueryOutput';

@Service()
export class GetUserAuthByJwtQueryHandler extends QueryHandler<HandleOption, GetUserAuthByJwtQueryOutput> {
    @Inject('auth_jwt.service')
    private readonly _authJwtService: IAuthJwtService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    async handle(handleOption: HandleOption): Promise<GetUserAuthByJwtQueryOutput> {
        const token = this._authJwtService.getTokenFromHeader(handleOption.req.headers);
        if (!token)
            throw new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token');

        let payload;
        try {
            payload = this._authJwtService.verify(token);
        }
        catch (error: any) {
            this._logService.error('Verify token', error, handleOption.trace.id);
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
            else
                throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');
        }

        if (!payload || !payload.sub || !payload.roleId || !payload.type)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token payload');

        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: payload.sub,
            roleId: payload.roleId,
            type: payload.type
        });
        return result;
    }
}
