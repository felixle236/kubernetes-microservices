import { IncomingHttpHeaders } from 'http';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';

export interface IVerifyUserAuthResponse {
    userId: string;
    roleId: string;
    type: string;
}

export interface IAuthenticationService {
    getTokenFromHeader(headers: IncomingHttpHeaders): string;

    verifyUserAuth(token: string, usecaseOption: UsecaseOption): Promise<IVerifyUserAuthResponse>;
}
