import { RoleId } from 'domain/enums/RoleId';
import { ArchiveManagerHandler } from 'application/usecases/manager/archive-manager/ArchiveManagerHandler';
import { ArchiveManagerOutput } from 'application/usecases/manager/archive-manager/ArchiveManagerOutput';
import { CreateManagerHandler } from 'application/usecases/manager/create-manager/CreateManagerHandler';
import { CreateManagerInput } from 'application/usecases/manager/create-manager/CreateManagerInput';
import { CreateManagerOutput } from 'application/usecases/manager/create-manager/CreateManagerOutput';
import { DeleteManagerHandler } from 'application/usecases/manager/delete-manager/DeleteManagerHandler';
import { DeleteManagerOutput } from 'application/usecases/manager/delete-manager/DeleteManagerOutput';
import { FindManagerHandler } from 'application/usecases/manager/find-manager/FindManagerHandler';
import { FindManagerInput } from 'application/usecases/manager/find-manager/FindManagerInput';
import { FindManagerOutput } from 'application/usecases/manager/find-manager/FindManagerOutput';
import { GetManagerHandler } from 'application/usecases/manager/get-manager/GetManagerHandler';
import { GetManagerOutput } from 'application/usecases/manager/get-manager/GetManagerOutput';
import { GetProfileManagerHandler } from 'application/usecases/manager/get-profile-manager/GetProfileManagerHandler';
import { GetProfileManagerOutput } from 'application/usecases/manager/get-profile-manager/GetProfileManagerOutput';
import { UpdateManagerHandler } from 'application/usecases/manager/update-manager/UpdateManagerHandler';
import { UpdateManagerInput } from 'application/usecases/manager/update-manager/UpdateManagerInput';
import { UpdateManagerOutput } from 'application/usecases/manager/update-manager/UpdateManagerOutput';
import { UpdateProfileManagerHandler } from 'application/usecases/manager/update-profile-manager/UpdateProfileManagerHandler';
import { UpdateProfileManagerInput } from 'application/usecases/manager/update-profile-manager/UpdateProfileManagerInput';
import { UpdateProfileManagerOutput } from 'application/usecases/manager/update-profile-manager/UpdateProfileManagerOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/accounts/managers')
export class ManagerController {
    constructor(
        private readonly _findManagerHandler: FindManagerHandler,
        private readonly _getManagerHandler: GetManagerHandler,
        private readonly _getProfileManagerHandler: GetProfileManagerHandler,
        private readonly _createManagerHandler: CreateManagerHandler,
        private readonly _updateManagerHandler: UpdateManagerHandler,
        private readonly _updateProfileManagerHandler: UpdateProfileManagerHandler,
        private readonly _deleteManagerHandler: DeleteManagerHandler,
        private readonly _archiveManagerHandler: ArchiveManagerHandler
    ) {}

    @Get('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Find managers' })
    @ResponseSchema(FindManagerOutput)
    find(@QueryParams() param: FindManagerInput): Promise<FindManagerOutput> {
        return this._findManagerHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Get manager' })
    @ResponseSchema(GetManagerOutput)
    get(@Param('id') id: string): Promise<GetManagerOutput> {
        return this._getManagerHandler.handle(id);
    }

    @Get('/profile')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get profile information' })
    @ResponseSchema(GetProfileManagerOutput)
    getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetProfileManagerOutput> {
        return this._getProfileManagerHandler.handle(userAuth.userId);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create manager account' })
    @ResponseSchema(CreateManagerOutput)
    create(@Body() param: CreateManagerInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<CreateManagerOutput> {
        return this._createManagerHandler.handle(param, usecaseOption);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update manager account' })
    @ResponseSchema(UpdateManagerOutput)
    update(@Param('id') id: string, @Body() param: UpdateManagerInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<UpdateManagerOutput> {
        return this._updateManagerHandler.handle(id, param, usecaseOption);
    }

    @Put('/profile')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Update profile information' })
    @ResponseSchema(UpdateProfileManagerOutput)
    updateProfile(@Body() param: UpdateProfileManagerInput, @CurrentUser() userAuth: UserAuthenticated, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<UpdateProfileManagerOutput> {
        return this._updateProfileManagerHandler.handle(userAuth.userId, param, usecaseOption);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete manager account' })
    @ResponseSchema(DeleteManagerOutput)
    delete(@Param('id') id: string, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<DeleteManagerOutput> {
        return this._deleteManagerHandler.handle(id, usecaseOption);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive manager account' })
    @ResponseSchema(ArchiveManagerOutput)
    archive(@Param('id') id: string, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ArchiveManagerOutput> {
        return this._archiveManagerHandler.handle(id, usecaseOption);
    }
}
