import { AUTH_PRIVATE_KEY, AUTH_URL } from '@configs/Configuration';
import { IAuthenticationService, ICreateUserAuthRequest, IVerifyUserAuthResponse } from '@gateways/services/IAuthenticationService';
import { DataResponse } from '@shared/usecase/DataResponse';
import { HandleOption } from '@shared/usecase/HandleOption';
import { handleAxiosResponseData, handleAxiosResponseError } from '@utils/api';
import axios from 'axios';
import { Service } from 'typedi';

@Service('authentication.service')
export class AuthenticationService implements IAuthenticationService {
    private readonly _axios = axios.create({
        baseURL: AUTH_URL,
        headers: {
            'x-private-key': AUTH_PRIVATE_KEY
        }
    });

    async verifyUserAuth(token: string, handleOption: HandleOption): Promise<IVerifyUserAuthResponse> {
        const headers = {
            'x-private-key': ''
        };
        handleOption.trace.setToHttpHeader(headers);

        const result: DataResponse<IVerifyUserAuthResponse> = await this._axios.get('/api/v1/auths?token=' + token, { headers })
            .then(handleAxiosResponseData)
            .catch(handleAxiosResponseError);
        return result.data;
    }

    async createUserAuth(data: ICreateUserAuthRequest, handleOption: HandleOption): Promise<boolean> {
        const headers = {};
        handleOption.trace.setToHttpHeader(headers);

        const res: DataResponse<string> = await this._axios.post('/api/v1/auths', data, { headers })
            .then(handleAxiosResponseData)
            .catch(handleAxiosResponseError);
        return !!res.data;
    }
}
