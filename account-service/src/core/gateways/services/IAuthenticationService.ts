import { HandleOption } from '@shared/usecase/HandleOption';

export interface IVerifyUserAuthResponse {
    userId: string;
    roleId: string;
}

export interface ICreateUserAuthRequest {
    userId: string;
    email: string;
    password: string;
}

export interface IAuthenticationService {
    verifyUserAuth(token: string, handleOption: HandleOption): Promise<IVerifyUserAuthResponse>;

    createUserAuth(data: ICreateUserAuthRequest, handleOption: HandleOption): Promise<boolean>;
}
