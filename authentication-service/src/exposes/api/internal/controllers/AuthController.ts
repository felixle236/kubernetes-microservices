import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from 'application/usecases/auth/create-auth-by-email/CreateAuthByEmailInput';
import { CreateAuthByEmailOutput } from 'application/usecases/auth/create-auth-by-email/CreateAuthByEmailOutput';
import { GetUserAuthByJwtHandler } from 'application/usecases/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { GetUserAuthByJwtOutput } from 'application/usecases/auth/get-user-auth-by-jwt/GetUserAuthByJwtOutput';
import { Request } from 'express';
import { Body, Get, JsonController, Post, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';

@Service()
@JsonController('/v1/auths')
export class AuthController {
    constructor(
        @Inject(InjectService.AuthJwt) private readonly _authJwtService: IAuthJwtService,
        private readonly _getUserAuthByJwtHandler: GetUserAuthByJwtHandler,
        private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler
    ) {}

    @Get('/')
    @OpenAPI({ summary: 'Get user authenticated by access token' })
    @ResponseSchema(GetUserAuthByJwtOutput)
    getUserAuth(@Req() req: Request, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<GetUserAuthByJwtOutput> {
        const token = this._authJwtService.getTokenFromHeader(req.headers);
        return this._getUserAuthByJwtHandler.handle(token, usecaseOption);
    }

    @Post('/')
    @OpenAPI({
        summary: 'Create user authentication',
        security: []
    })
    @ResponseSchema(CreateAuthByEmailOutput)
    async createUserAuth(@Body() param: CreateAuthByEmailInput): Promise<CreateAuthByEmailOutput> {
        return await this._createAuthByEmailHandler.handle(param);
    }
}
