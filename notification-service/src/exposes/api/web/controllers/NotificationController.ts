import { RoleId } from 'domain/enums/RoleId';
import { CreateNotificationHandler } from 'application/usecases/notification/create-notification/CreateNotificationHandler';
import { CreateNotificationInput } from 'application/usecases/notification/create-notification/CreateNotificationInput';
import { CreateNotificationOutput } from 'application/usecases/notification/create-notification/CreateNotificationOutput';
import { DeleteNotificationHandler } from 'application/usecases/notification/delete-notification/DeleteNotificationHandler';
import { DeleteNotificationOutput } from 'application/usecases/notification/delete-notification/DeleteNotificationOutput';
import { FindNotificationHandler } from 'application/usecases/notification/find-notification/FindNotificationHandler';
import { FindNotificationInput } from 'application/usecases/notification/find-notification/FindNotificationInput';
import { FindNotificationOutput } from 'application/usecases/notification/find-notification/FindNotificationOutput';
import { GetNotificationHandler } from 'application/usecases/notification/get-notification/GetNotificationHandler';
import { GetNotificationOutput } from 'application/usecases/notification/get-notification/GetNotificationOutput';
import { GetTotalNewNotificationHandler } from 'application/usecases/notification/get-total-new-notification/GetTotalNewNotificationHandler';
import { GetTotalNewNotificationOutput } from 'application/usecases/notification/get-total-new-notification/GetTotalNewNotificationOutput';
import { GetUnreadNotificationStatusByIdsHandler } from 'application/usecases/notification/get-unread-notification-status-by-ids/GetUnreadNotificationStatusByIdsHandler';
import { GetUnreadNotificationStatusByIdsInput } from 'application/usecases/notification/get-unread-notification-status-by-ids/GetUnreadNotificationStatusByIdsInput';
import { GetUnreadNotificationStatusByIdsOutput } from 'application/usecases/notification/get-unread-notification-status-by-ids/GetUnreadNotificationStatusByIdsOutput';
import { PushNotificationHandler } from 'application/usecases/notification/push-notification/PushNotificationHandler';
import { PushNotificationOutput } from 'application/usecases/notification/push-notification/PushNotificationOutput';
import { RemoveUnreadNotificationStatusHandler } from 'application/usecases/notification/remove-unread-notification-status/RemoveUnreadNotificationStatusHandler';
import { RemoveUnreadNotificationStatusInput } from 'application/usecases/notification/remove-unread-notification-status/RemoveUnreadNotificationStatusInput';
import { RemoveUnreadNotificationStatusOutput } from 'application/usecases/notification/remove-unread-notification-status/RemoveUnreadNotificationStatusOutput';
import { UpdateNotificationHandler } from 'application/usecases/notification/update-notification/UpdateNotificationHandler';
import { UpdateNotificationInput } from 'application/usecases/notification/update-notification/UpdateNotificationInput';
import { UpdateNotificationOutput } from 'application/usecases/notification/update-notification/UpdateNotificationOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/notifications')
export class NotificationController {
    constructor(
        private readonly _findNotificationHandler: FindNotificationHandler,
        private readonly _getNotificationHandler: GetNotificationHandler,
        private readonly _getTotalNewNotificationHandler: GetTotalNewNotificationHandler,
        private readonly _getUnreadNotificationStatusByIdsHandler: GetUnreadNotificationStatusByIdsHandler,
        private readonly _createNotificationHandler: CreateNotificationHandler,
        private readonly _pushNotificationHandler: PushNotificationHandler,
        private readonly _updateNotificationHandler: UpdateNotificationHandler,
        private readonly _deleteNotificationHandler: DeleteNotificationHandler,
        private readonly _removeUnreadNotificationStatusHandler: RemoveUnreadNotificationStatusHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({ summary: 'Find notification' })
    @ResponseSchema(FindNotificationOutput)
    async find(@QueryParams() param: FindNotificationInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<FindNotificationOutput> {
        return await this._findNotificationHandler.handle(param, usecaseOption);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Get notification' })
    @ResponseSchema(GetNotificationOutput)
    async get(@Param('id') id: string): Promise<GetNotificationOutput> {
        return await this._getNotificationHandler.handle(id);
    }

    @Get('/count-unread')
    @Authorized()
    @OpenAPI({ summary: 'Get total unread notification' })
    @ResponseSchema(GetTotalNewNotificationOutput)
    async getTotalNewNotification(@UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<GetTotalNewNotificationOutput> {
        return await this._getTotalNewNotificationHandler.handle(usecaseOption);
    }

    @Get('/unread-status-by-ids')
    @Authorized()
    @OpenAPI({ summary: 'Get unread status by ids' })
    @ResponseSchema(GetUnreadNotificationStatusByIdsOutput)
    async getUnreadNotificationStatusByIds(@QueryParams() param: GetUnreadNotificationStatusByIdsInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<GetUnreadNotificationStatusByIdsOutput> {
        return await this._getUnreadNotificationStatusByIdsHandler.handle(param, usecaseOption);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create notification' })
    @ResponseSchema(CreateNotificationOutput)
    async create(@Body() param: CreateNotificationInput): Promise<CreateNotificationOutput> {
        return await this._createNotificationHandler.handle(param);
    }

    @Post('/:id([0-9a-f-]{36})/push')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Push notification' })
    @ResponseSchema(PushNotificationOutput)
    async pushNotification(@Param('id') id: string): Promise<PushNotificationOutput> {
        return await this._pushNotificationHandler.handle(id);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update notification' })
    @ResponseSchema(UpdateNotificationOutput)
    async update(@Param('id') id: string, @Body() param: UpdateNotificationInput): Promise<UpdateNotificationOutput> {
        return await this._updateNotificationHandler.handle(id, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete notification' })
    @ResponseSchema(DeleteNotificationOutput)
    async delete(@Param('id') id: string): Promise<DeleteNotificationOutput> {
        return await this._deleteNotificationHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/status')
    @Authorized()
    @OpenAPI({ summary: 'Add unread notification status' })
    @ResponseSchema(RemoveUnreadNotificationStatusOutput)
    async removeUnreadNotificationStatus(@Param('id') id: string, @CurrentUser() userAuth: UserAuthenticated): Promise<RemoveUnreadNotificationStatusOutput> {
        const param = new RemoveUnreadNotificationStatusInput();
        param.userId = userAuth.userId;
        param.notificationId = id;
        return await this._removeUnreadNotificationStatusHandler.handle(param);
    }
}
