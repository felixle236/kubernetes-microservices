import { RoleId } from '@domain/enums/user/RoleId';
import { HandleOptionRequest } from '@shared/decorators/HandleOptionRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { CreateNotificationCommandHandler } from '@usecases/notification/notification/commands/create-notification/CreateNotificationCommandHandler';
import { CreateNotificationCommandInput } from '@usecases/notification/notification/commands/create-notification/CreateNotificationCommandInput';
import { CreateNotificationCommandOutput } from '@usecases/notification/notification/commands/create-notification/CreateNotificationCommandOutput';
import { DeleteNotificationCommandHandler } from '@usecases/notification/notification/commands/delete-notification/DeleteNotificationCommandHandler';
import { DeleteNotificationCommandOutput } from '@usecases/notification/notification/commands/delete-notification/DeleteNotificationCommandOutput';
import { RemoveNewNotificationStatusCommandHandler } from '@usecases/notification/notification/commands/remove-new-notification-status/RemoveNewNotificationStatusCommandHandler';
import { RemoveNewNotificationStatusCommandInput } from '@usecases/notification/notification/commands/remove-new-notification-status/RemoveNewNotificationStatusCommandInput';
import { RemoveNewNotificationStatusCommandOutput } from '@usecases/notification/notification/commands/remove-new-notification-status/RemoveNewNotificationStatusCommandOutput';
import { UpdateNotificationCommandHandler } from '@usecases/notification/notification/commands/update-notification/UpdateNotificationCommandHandler';
import { UpdateNotificationCommandInput } from '@usecases/notification/notification/commands/update-notification/UpdateNotificationCommandInput';
import { UpdateNotificationCommandOutput } from '@usecases/notification/notification/commands/update-notification/UpdateNotificationCommandOutput';
import { CountNewNotificationStatusQueryHandler } from '@usecases/notification/notification/queries/count-new-notification-status/CountNewNotificationStatusQueryHandler';
import { CountNewNotificationStatusQueryInput } from '@usecases/notification/notification/queries/count-new-notification-status/CountNewNotificationStatusQueryInput';
import { CountNewNotificationStatusQueryOutput } from '@usecases/notification/notification/queries/count-new-notification-status/CountNewNotificationStatusQueryOutput';
import { FindNotificationQueryHandler } from '@usecases/notification/notification/queries/find-notification/FindNotificationQueryHandler';
import { FindNotificationQueryInput } from '@usecases/notification/notification/queries/find-notification/FindNotificationQueryInput';
import { FindNotificationQueryOutput } from '@usecases/notification/notification/queries/find-notification/FindNotificationQueryOutput';
import { GetNotificationByIdQueryHandler } from '@usecases/notification/notification/queries/get-notification-by-id/GetNotificationByIdQueryHandler';
import { GetNotificationByIdQueryOutput } from '@usecases/notification/notification/queries/get-notification-by-id/GetNotificationByIdQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/notifications')
export class NotificationController {
    constructor(
        private readonly _findNotificationQueryHandler: FindNotificationQueryHandler,
        private readonly _getNotificationByIdQueryHandler: GetNotificationByIdQueryHandler,
        private readonly _countNewNotificationStatusQueryHandler: CountNewNotificationStatusQueryHandler,
        private readonly _createNotificationCommandHandler: CreateNotificationCommandHandler,
        private readonly _updateNotificationCommandHandler: UpdateNotificationCommandHandler,
        private readonly _deleteNotificationCommandHandler: DeleteNotificationCommandHandler,
        private readonly _removeNewNotificationStatusCommandHandler: RemoveNewNotificationStatusCommandHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({ summary: 'Find notifications' })
    @ResponseSchema(FindNotificationQueryOutput)
    async find(@QueryParams() param: FindNotificationQueryInput, @HandleOptionRequest() handleOption: HandleOption): Promise<FindNotificationQueryOutput> {
        return await this._findNotificationQueryHandler.handle(param, handleOption);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Get notification by id' })
    @ResponseSchema(GetNotificationByIdQueryOutput)
    async getById(@Param('id') id: string, @HandleOptionRequest() handleOption: HandleOption): Promise<GetNotificationByIdQueryOutput> {
        return await this._getNotificationByIdQueryHandler.handle(id, handleOption);
    }

    @Get('/count-new-status')
    @Authorized()
    @OpenAPI({ summary: 'Count new notification status' })
    @ResponseSchema(CountNewNotificationStatusQueryOutput)
    async countNewNotificationStatus(@CurrentUser() userAuth: UserAuthenticated): Promise<CountNewNotificationStatusQueryOutput> {
        const param = new CountNewNotificationStatusQueryInput();
        param.receiverId = userAuth.userId;

        return await this._countNewNotificationStatusQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create notification' })
    @ResponseSchema(CreateNotificationCommandOutput)
    async create(@Body() param: CreateNotificationCommandInput): Promise<CreateNotificationCommandOutput> {
        return await this._createNotificationCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update notification' })
    @ResponseSchema(UpdateNotificationCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateNotificationCommandInput): Promise<UpdateNotificationCommandOutput> {
        return await this._updateNotificationCommandHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete notification' })
    @ResponseSchema(DeleteNotificationCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteNotificationCommandOutput> {
        return await this._deleteNotificationCommandHandler.handle(id);
    }

    @Delete('/remove-new-status')
    @Authorized()
    @OpenAPI({ summary: 'Remove new notification status' })
    @ResponseSchema(RemoveNewNotificationStatusCommandOutput)
    async removeNewNotificationStatus(@CurrentUser() userAuth: UserAuthenticated): Promise<RemoveNewNotificationStatusCommandOutput> {
        const param = new RemoveNewNotificationStatusCommandInput();
        param.receiverId = userAuth.userId;

        return await this._removeNewNotificationStatusCommandHandler.handle(param);
    }
}
