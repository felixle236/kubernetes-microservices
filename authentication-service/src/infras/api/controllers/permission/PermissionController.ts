import { PrivateAccessMiddleware } from '@infras/api/middlewares/PrivateAccessMiddleware';
import { CreateUpdatePermissionCommandHandler } from '@usecases/permission/permission/commands/create-permission/CreateUpdatePermissionCommandHandler';
import { CreateUpdatePermissionCommandInput } from '@usecases/permission/permission/commands/create-permission/CreateUpdatePermissionCommandInput';
import { CreateUpdatePermissionCommandOutput } from '@usecases/permission/permission/commands/create-permission/CreateUpdatePermissionCommandOutput';
import { DeletePermissionCommandHandler } from '@usecases/permission/permission/commands/delete-permission/DeletePermissionCommandHandler';
import { DeletePermissionCommandOutput } from '@usecases/permission/permission/commands/delete-permission/DeletePermissionCommandOutput';
import { FindPermissionQueryHandler } from '@usecases/permission/permission/queries/find-permission/FindPermissionQueryHandler';
import { FindPermissionQueryInput } from '@usecases/permission/permission/queries/find-permission/FindPermissionQueryInput';
import { FindPermissionQueryOutput } from '@usecases/permission/permission/queries/find-permission/FindPermissionQueryOutput';
import { GetPermissionByIdQueryHandler } from '@usecases/permission/permission/queries/get-permission-by-id/GetPermissionByIdQueryHandler';
import { GetPermissionByIdQueryOutput } from '@usecases/permission/permission/queries/get-permission-by-id/GetPermissionByIdQueryOutput';
import { Body, Delete, Get, JsonController, Param, Post, QueryParams, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/permissions')
export class PermissionController {
    constructor(
        private readonly _findPermissionQueryHandler: FindPermissionQueryHandler,
        private readonly _getPermissionByIdQueryHandler: GetPermissionByIdQueryHandler,
        private readonly _createUpdatePermissionCommandHandler: CreateUpdatePermissionCommandHandler,
        private readonly _deletePermissionCommandHandler: DeletePermissionCommandHandler
    ) {}

    @Get('/')
    @UseBefore(PrivateAccessMiddleware)
    @OpenAPI({ summary: 'Find permission' })
    @ResponseSchema(FindPermissionQueryOutput)
    async find(@QueryParams() param: FindPermissionQueryInput): Promise<FindPermissionQueryOutput> {
        return await this._findPermissionQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @UseBefore(PrivateAccessMiddleware)
    @OpenAPI({ summary: 'Get permission by id' })
    @ResponseSchema(GetPermissionByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetPermissionByIdQueryOutput> {
        return await this._getPermissionByIdQueryHandler.handle(id);
    }

    @Post('/')
    @UseBefore(PrivateAccessMiddleware)
    @OpenAPI({ summary: 'Create or update permission' })
    @ResponseSchema(CreateUpdatePermissionCommandOutput)
    async create(@Body() param: CreateUpdatePermissionCommandInput): Promise<CreateUpdatePermissionCommandOutput> {
        return await this._createUpdatePermissionCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @UseBefore(PrivateAccessMiddleware)
    @OpenAPI({ summary: 'Delete permission' })
    @ResponseSchema(DeletePermissionCommandOutput)
    async delete(@Param('id') id: string): Promise<DeletePermissionCommandOutput> {
        return await this._deletePermissionCommandHandler.handle(id);
    }
}
