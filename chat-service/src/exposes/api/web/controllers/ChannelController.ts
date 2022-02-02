import { CreateChannelHandler } from 'application/usecases/channel/create-channel/CreateChannelHandler';
import { CreateChannelInput } from 'application/usecases/channel/create-channel/CreateChannelInput';
import { CreateChannelOutput } from 'application/usecases/channel/create-channel/CreateChannelOutput';
import { DeleteChannelHandler } from 'application/usecases/channel/delete-channel/DeleteChannelHandler';
import { DeleteChannelOutput } from 'application/usecases/channel/delete-channel/DeleteChannelOutput';
import { FindChannelHandler } from 'application/usecases/channel/find-channel/FindChannelHandler';
import { FindChannelInput } from 'application/usecases/channel/find-channel/FindChannelInput';
import { FindChannelOutput } from 'application/usecases/channel/find-channel/FindChannelOutput';
import { Authorized, Body, Delete, Get, JsonController, Param, Post, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/chats/channels')
export class ChannelController {
    constructor(
        private readonly _findChannelHandler: FindChannelHandler,
        private readonly _createChannelHandler: CreateChannelHandler,
        private readonly _deleteChannelHandler: DeleteChannelHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({ summary: 'Find channel' })
    @ResponseSchema(FindChannelOutput)
    async find(@QueryParams() param: FindChannelInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<FindChannelOutput> {
        return await this._findChannelHandler.handle(param, usecaseOption);
    }

    @Post('/')
    @Authorized()
    @OpenAPI({ summary: 'Create channel' })
    @ResponseSchema(CreateChannelOutput)
    async create(@Body() param: CreateChannelInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<CreateChannelOutput> {
        return await this._createChannelHandler.handle(param, usecaseOption);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Delete channel' })
    @ResponseSchema(DeleteChannelOutput)
    async delete(@Param('id') id: string, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<DeleteChannelOutput> {
        return await this._deleteChannelHandler.handle(id, usecaseOption);
    }
}
