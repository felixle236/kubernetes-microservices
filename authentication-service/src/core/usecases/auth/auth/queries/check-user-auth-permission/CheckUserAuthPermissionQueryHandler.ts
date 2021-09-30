import { IPermissionRepository } from '@gateways/repositories/permission/IPermissionRepository';
import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { ILogService } from '@gateways/services/ILogService';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { CheckUserAuthPermissionQueryOutput } from './CheckUserAuthPermissionQueryOutput';

@Service()
export class CheckUserAuthPermissionQueryHandler extends QueryHandler<string, CheckUserAuthPermissionQueryOutput> {
    @Inject('permission.repository')
    private readonly _permissionRepository: IPermissionRepository;

    @Inject('auth_jwt.service')
    private readonly _authJwtService: IAuthJwtService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    async handle(handleOption: HandleOption): Promise<CheckUserAuthPermissionQueryOutput> {
        let path = handleOption.req.headers['x-original-uri'] as string || '';
        path = path.split('?')[0];
        const method = handleOption.req.headers['x-original-method'] as string;

        const permissions = await this._permissionRepository.getAllWithCaching();
        const permission = permissions.find(permission => new RegExp('^' + permission.path + '$').test(path));
        const perItem = permission?.items.find(item => item.method === method);
        if (!permission || !perItem)
            throw new AccessDeniedError();

        if (perItem.isRequired) {
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

            handleOption.res.setHeader('X-User-Id', payload.sub);
            handleOption.res.setHeader('X-Role-Id', payload.roleId);

            if (perItem.roleIds && perItem.roleIds.length && !perItem.roleIds.some(roleId => roleId === payload.roleId))
                throw new AccessDeniedError();
        }

        const result = new CheckUserAuthPermissionQueryOutput();
        result.setData(true);
        return result;
    }
}
