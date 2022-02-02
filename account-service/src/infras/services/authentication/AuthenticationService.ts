import { IncomingHttpHeaders } from 'http';
import { IAuthenticationService, ICreateUserAuthRequest, IVerifyUserAuthResponse } from 'application/interfaces/services/IAuthenticationService';
import { ILogService } from 'application/interfaces/services/ILogService';
import axios, { AxiosInstance } from 'axios';
import { AUTH_INTERNAL_PRIVATE_KEY, AUTH_URL } from 'config/Configuration';
import qs from 'qs';
import { HttpHeaderKey } from 'shared/types/Common';
import { InjectService } from 'shared/types/Injection';
import { DataResponse } from 'shared/usecase/DataResponse';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { handleAxiosResponseData, handleAxiosResponseError } from 'utils/Api';

@Service(InjectService.Auth)
export class AuthenticationService implements IAuthenticationService {
    private readonly _axios: AxiosInstance;

    constructor(
        @Inject(InjectService.Log) private readonly _logService: ILogService
    ) {
        this._axios = axios.create({
            baseURL: AUTH_URL,
            headers: {
                [HttpHeaderKey.PrivateKey]: AUTH_INTERNAL_PRIVATE_KEY
            }
        });
    }

    private _customHeaders(headers: IncomingHttpHeaders, usecaseOption: UsecaseOption): IncomingHttpHeaders {
        usecaseOption.trace.setToHttpHeader(headers);

        if (usecaseOption.userAuth) {
            headers[HttpHeaderKey.UserId] = usecaseOption.userAuth.userId;
            headers[HttpHeaderKey.RoleId] = usecaseOption.userAuth.roleId;
            headers[HttpHeaderKey.AuthType] = usecaseOption.userAuth.type;
        }
        return headers;
    }

    getTokenFromHeader(headers: IncomingHttpHeaders): string {
        let token = '';
        if (headers.authorization) {
            const parts = headers.authorization.split(' ');
            token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        }
        return token;
    }

    async verifyUserAuth(token: string, usecaseOption: UsecaseOption): Promise<IVerifyUserAuthResponse> {
        const headers = { authorization: 'Bearer ' + token };
        this._customHeaders(headers, usecaseOption);

        const result: DataResponse<IVerifyUserAuthResponse> = await this._axios.get('/api/v1/auths', { headers })
            .then(res => handleAxiosResponseData(this._logService, usecaseOption.trace, res))
            .catch(error => handleAxiosResponseError(this._logService, usecaseOption.trace, error));
        return result.data;
    }

    async createUserAuth(data: ICreateUserAuthRequest, usecaseOption: UsecaseOption): Promise<boolean> {
        const headers = {};
        this._customHeaders(headers, usecaseOption);

        const result: DataResponse<string> = await this._axios.post('/api/v1/auths', data, { headers })
            .then(res => handleAxiosResponseData(this._logService, usecaseOption.trace, res))
            .catch(error => handleAxiosResponseError(this._logService, usecaseOption.trace, error));
        return !!result.data;
    }

    async deleteUserAuthByUser(userId: string, usecaseOption: UsecaseOption): Promise<boolean> {
        const headers = {};
        this._customHeaders(headers, usecaseOption);

        const result: DataResponse<string> = await this._axios.delete('/api/v1/auths?' + qs.stringify({ userId }), { headers })
            .then(res => handleAxiosResponseData(this._logService, usecaseOption.trace, res))
            .catch(error => handleAxiosResponseError(this._logService, usecaseOption.trace, error));
        return !!result.data;
    }
}
