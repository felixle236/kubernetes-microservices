import { ForgotPasswordByEmailHandler } from 'application/usecases/auth/forgot-password-by-email/ForgotPasswordByEmailHandler';
import { ForgotPasswordByEmailInput } from 'application/usecases/auth/forgot-password-by-email/ForgotPasswordByEmailInput';
import { ForgotPasswordByEmailOutput } from 'application/usecases/auth/forgot-password-by-email/ForgotPasswordByEmailOutput';
import { LoginByEmailHandler } from 'application/usecases/auth/login-by-email/LoginByEmailHandler';
import { LoginByEmailInput } from 'application/usecases/auth/login-by-email/LoginByEmailInput';
import { LoginByEmailOutput } from 'application/usecases/auth/login-by-email/LoginByEmailOutput';
import { ResetPasswordByEmailHandler } from 'application/usecases/auth/reset-password-by-email/ResetPasswordByEmailHandler';
import { ResetPasswordByEmailInput } from 'application/usecases/auth/reset-password-by-email/ResetPasswordByEmailInput';
import { ResetPasswordByEmailOutput } from 'application/usecases/auth/reset-password-by-email/ResetPasswordByEmailOutput';
import { UpdateMyPasswordByEmailHandler } from 'application/usecases/auth/update-my-password-by-email/UpdateMyPasswordByEmailHandler';
import { UpdateMyPasswordByEmailInput } from 'application/usecases/auth/update-my-password-by-email/UpdateMyPasswordByEmailInput';
import { UpdateMyPasswordByEmailOutput } from 'application/usecases/auth/update-my-password-by-email/UpdateMyPasswordByEmailOutput';
import { ValidateForgotKeyForEmailHandler } from 'application/usecases/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailHandler';
import { ValidateForgotKeyForEmailInput } from 'application/usecases/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailInput';
import { ValidateForgotKeyForEmailOutput } from 'application/usecases/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailOutput';
import { Authorized, Body, CurrentUser, JsonController, Patch, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/auths')
export class AuthController {
    constructor(
        private readonly _loginByEmailHandler: LoginByEmailHandler,
        private readonly _forgotPasswordByEmailHandler: ForgotPasswordByEmailHandler,
        private readonly _validateForgotKeyForEmailHandler: ValidateForgotKeyForEmailHandler,
        private readonly _resetPasswordByEmailHandler: ResetPasswordByEmailHandler,
        private readonly _updateMyPasswordByEmailHandler: UpdateMyPasswordByEmailHandler
    ) {}

    @Post('/login')
    @OpenAPI({
        summary: 'Authenticate user by email and password',
        description: 'Applies to any user<br/>Return access token',
        security: []
    })
    @ResponseSchema(LoginByEmailOutput)
    login(@Body() param: LoginByEmailInput): Promise<LoginByEmailOutput> {
        return this._loginByEmailHandler.handle(param);
    }

    @Post('/forgot-password')
    @OpenAPI({
        summary: 'Forgot user\'s password by email',
        security: []
    })
    @ResponseSchema(ForgotPasswordByEmailOutput)
    forgotPassword(@Body() param: ForgotPasswordByEmailInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ForgotPasswordByEmailOutput> {
        return this._forgotPasswordByEmailHandler.handle(param, usecaseOption);
    }

    @Post('/validate-forgot-key')
    @OpenAPI({
        summary: 'Validate the forgot key by email and key',
        security: []
    })
    @ResponseSchema(ValidateForgotKeyForEmailOutput)
    validateForgotKey(@Body() param: ValidateForgotKeyForEmailInput): Promise<ValidateForgotKeyForEmailOutput> {
        return this._validateForgotKeyForEmailHandler.handle(param);
    }

    @Post('/reset-password')
    @OpenAPI({
        summary: 'Reset user\'s password',
        security: []
    })
    @ResponseSchema(ResetPasswordByEmailOutput)
    resetPassword(@Body() param: ResetPasswordByEmailInput): Promise<ResetPasswordByEmailOutput> {
        return this._resetPasswordByEmailHandler.handle(param);
    }

    @Patch('/password')
    @Authorized()
    @OpenAPI({ summary: 'Update my password' })
    @ResponseSchema(UpdateMyPasswordByEmailOutput)
    updateMyPassword(@Body() param: UpdateMyPasswordByEmailInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyPasswordByEmailOutput> {
        return this._updateMyPasswordByEmailHandler.handle(userAuth.userId, param);
    }
}
