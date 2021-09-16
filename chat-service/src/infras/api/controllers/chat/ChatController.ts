import { HandleOptionRequest } from '@shared/decorators/HandleOptionRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { CreateChatCommandHandler } from '@usecases/chat/chat/commands/create-chat/CreateChatCommandHandler';
import { CreateChatCommandInput } from '@usecases/chat/chat/commands/create-chat/CreateChatCommandInput';
import { CreateChatCommandOutput } from '@usecases/chat/chat/commands/create-chat/CreateChatCommandOutput';
import { DeleteChatCommandHandler } from '@usecases/chat/chat/commands/delete-chat/DeleteChatCommandHandler';
import { DeleteChatCommandOutput } from '@usecases/chat/chat/commands/delete-chat/DeleteChatCommandOutput';
import { UpdateChatCommandHandler } from '@usecases/chat/chat/commands/update-chat/UpdateChatCommandHandler';
import { UpdateChatCommandInput } from '@usecases/chat/chat/commands/update-chat/UpdateChatCommandInput';
import { UpdateChatCommandOutput } from '@usecases/chat/chat/commands/update-chat/UpdateChatCommandOutput';
import { FindChatQueryHandler } from '@usecases/chat/chat/queries/find-chat/FindChatQueryHandler';
import { FindChatQueryInput } from '@usecases/chat/chat/queries/find-chat/FindChatQueryInput';
import { FindChatQueryOutput } from '@usecases/chat/chat/queries/find-chat/FindChatQueryOutput';
import { GetChatByIdQueryHandler } from '@usecases/chat/chat/queries/get-chat-by-id/GetChatByIdQueryHandler';
import { GetChatByIdQueryOutput } from '@usecases/chat/chat/queries/get-chat-by-id/GetChatByIdQueryOutput';
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/chats')
export class ChatController {
    constructor(
        private readonly _findChatQueryHandler: FindChatQueryHandler,
        private readonly _getChatByIdQueryHandler: GetChatByIdQueryHandler,
        private readonly _createChatCommandHandler: CreateChatCommandHandler,
        private readonly _updateChatCommandHandler: UpdateChatCommandHandler,
        private readonly _deleteChatCommandHandler: DeleteChatCommandHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({ summary: 'Find chats' })
    @ResponseSchema(FindChatQueryOutput)
    async find(@QueryParams() param: FindChatQueryInput, @HandleOptionRequest() handleOption: HandleOption): Promise<FindChatQueryOutput> {
        return await this._findChatQueryHandler.handle(param, handleOption);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Get chat by id' })
    @ResponseSchema(GetChatByIdQueryOutput)
    async getById(@Param('id') id: string, @HandleOptionRequest() handleOption: HandleOption): Promise<GetChatByIdQueryOutput> {
        return await this._getChatByIdQueryHandler.handle(id, handleOption);
    }

    @Post('/')
    @Authorized()
    @OpenAPI({ summary: 'Create chat' })
    @ResponseSchema(CreateChatCommandOutput)
    async create(@Body() param: CreateChatCommandInput, @HandleOptionRequest() handleOption: HandleOption): Promise<CreateChatCommandOutput> {
        return await this._createChatCommandHandler.handle(param, handleOption);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Update chat' })
    @ResponseSchema(UpdateChatCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateChatCommandInput, @HandleOptionRequest() handleOption: HandleOption): Promise<UpdateChatCommandOutput> {
        return await this._updateChatCommandHandler.handle(id, param, handleOption);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Delete chat' })
    @ResponseSchema(DeleteChatCommandOutput)
    async delete(@Param('id') id: string, @HandleOptionRequest() handleOption: HandleOption): Promise<DeleteChatCommandOutput> {
        return await this._deleteChatCommandHandler.handle(id, handleOption);
    }
}
