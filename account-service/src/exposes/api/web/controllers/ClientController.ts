import { RoleId } from 'domain/enums/RoleId';
import { ActiveClientHandler } from 'application/usecases/client/active-client/ActiveClientHandler';
import { ActiveClientInput } from 'application/usecases/client/active-client/ActiveClientInput';
import { ActiveClientOutput } from 'application/usecases/client/active-client/ActiveClientOutput';
import { ArchiveClientHandler } from 'application/usecases/client/archive-client/ArchiveClientHandler';
import { ArchiveClientOutput } from 'application/usecases/client/archive-client/ArchiveClientOutput';
import { CreateClientHandler } from 'application/usecases/client/create-client/CreateClientHandler';
import { CreateClientInput } from 'application/usecases/client/create-client/CreateClientInput';
import { CreateClientOutput } from 'application/usecases/client/create-client/CreateClientOutput';
import { DeleteClientHandler } from 'application/usecases/client/delete-client/DeleteClientHandler';
import { DeleteClientOutput } from 'application/usecases/client/delete-client/DeleteClientOutput';
import { FindClientHandler } from 'application/usecases/client/find-client/FindClientHandler';
import { FindClientInput } from 'application/usecases/client/find-client/FindClientInput';
import { FindClientOutput } from 'application/usecases/client/find-client/FindClientOutput';
import { GetClientHandler } from 'application/usecases/client/get-client/GetClientHandler';
import { GetClientOutput } from 'application/usecases/client/get-client/GetClientOutput';
import { GetProfileClientHandler } from 'application/usecases/client/get-profile-client/GetProfileClientHandler';
import { GetProfileClientOutput } from 'application/usecases/client/get-profile-client/GetProfileClientOutput';
import { RegisterClientHandler } from 'application/usecases/client/register-client/RegisterClientHandler';
import { RegisterClientInput } from 'application/usecases/client/register-client/RegisterClientInput';
import { RegisterClientOutput } from 'application/usecases/client/register-client/RegisterClientOutput';
import { ResendActivationHandler } from 'application/usecases/client/resend-activation/ResendActivationHandler';
import { ResendActivationInput } from 'application/usecases/client/resend-activation/ResendActivationInput';
import { ResendActivationOutput } from 'application/usecases/client/resend-activation/ResendActivationOutput';
import { UpdateClientHandler } from 'application/usecases/client/update-client/UpdateClientHandler';
import { UpdateClientInput } from 'application/usecases/client/update-client/UpdateClientInput';
import { UpdateClientOutput } from 'application/usecases/client/update-client/UpdateClientOutput';
import { UpdateProfileClientHandler } from 'application/usecases/client/update-profile-client/UpdateProfileClientHandler';
import { UpdateProfileClientInput } from 'application/usecases/client/update-profile-client/UpdateProfileClientInput';
import { UpdateProfileClientOutput } from 'application/usecases/client/update-profile-client/UpdateProfileClientOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/accounts/clients')
export class ClientController {
    constructor(
        private readonly _findClientHandler: FindClientHandler,
        private readonly _getClientHandler: GetClientHandler,
        private readonly _getProfileClientHandler: GetProfileClientHandler,
        private readonly _registerClientHandler: RegisterClientHandler,
        private readonly _activeClientHandler: ActiveClientHandler,
        private readonly _resendActivationHandler: ResendActivationHandler,
        private readonly _createClientHandler: CreateClientHandler,
        private readonly _updateClientHandler: UpdateClientHandler,
        private readonly _updateProfileClientHandler: UpdateProfileClientHandler,
        private readonly _deleteClientHandler: DeleteClientHandler,
        private readonly _archiveClientHandler: ArchiveClientHandler
    ) {}

    @Get('/')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Find clients' })
    @ResponseSchema(FindClientOutput)
    find(@QueryParams() param: FindClientInput): Promise<FindClientOutput> {
        return this._findClientHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get client' })
    @ResponseSchema(GetClientOutput)
    get(@Param('id') id: string): Promise<GetClientOutput> {
        return this._getClientHandler.handle(id);
    }

    @Get('/profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Get profile information' })
    @ResponseSchema(GetProfileClientOutput)
    getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetProfileClientOutput> {
        return this._getProfileClientHandler.handle(userAuth.userId);
    }

    @Post('/register')
    @OpenAPI({ summary: 'Register new client account' })
    @ResponseSchema(RegisterClientOutput)
    register(@Body() param: RegisterClientInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<RegisterClientOutput> {
        return this._registerClientHandler.handle(param, usecaseOption);
    }

    @Post('/active')
    @OpenAPI({ summary: 'Active client account' })
    @ResponseSchema(ActiveClientOutput)
    active(@Body() param: ActiveClientInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ActiveClientOutput> {
        return this._activeClientHandler.handle(param, usecaseOption);
    }

    @Post('/resend-activation')
    @OpenAPI({ summary: 'Resend activation for client' })
    @ResponseSchema(ResendActivationOutput)
    resendActivation(@Body() param: ResendActivationInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
        return this._resendActivationHandler.handle(param, usecaseOption);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create client account' })
    @ResponseSchema(CreateClientOutput)
    create(@Body() param: CreateClientInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<CreateClientOutput> {
        return this._createClientHandler.handle(param, usecaseOption);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update client account' })
    @ResponseSchema(UpdateClientOutput)
    update(@Param('id') id: string, @Body() param: UpdateClientInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<UpdateClientOutput> {
        return this._updateClientHandler.handle(id, param, usecaseOption);
    }

    @Put('/profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Update profile information' })
    @ResponseSchema(UpdateProfileClientOutput)
    updateProfile(@Body() param: UpdateProfileClientInput, @CurrentUser() userAuth: UserAuthenticated, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<UpdateProfileClientOutput> {
        return this._updateProfileClientHandler.handle(userAuth.userId, param, usecaseOption);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete client account' })
    @ResponseSchema(DeleteClientOutput)
    delete(@Param('id') id: string, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<DeleteClientOutput> {
        return this._deleteClientHandler.handle(id, usecaseOption);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive client account' })
    @ResponseSchema(ArchiveClientOutput)
    archive(@Param('id') id: string, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ArchiveClientOutput> {
        return this._archiveClientHandler.handle(id, usecaseOption);
    }
}
