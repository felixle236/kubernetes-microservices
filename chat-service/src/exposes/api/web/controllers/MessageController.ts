import { CreateMessageHandler } from 'application/usecases/message/create-message/CreateMessageHandler';
import { CreateMessageInput } from 'application/usecases/message/create-message/CreateMessageInput';
import { CreateMessageOutput } from 'application/usecases/message/create-message/CreateMessageOutput';
import { DeleteMessageHandler } from 'application/usecases/message/delete-message/DeleteMessageHandler';
import { DeleteMessageOutput } from 'application/usecases/message/delete-message/DeleteMessageOutput';
import { FindMessageHandler } from 'application/usecases/message/find-message/FindMessageHandler';
import { FindMessageInput } from 'application/usecases/message/find-message/FindMessageInput';
import { FindMessageOutput } from 'application/usecases/message/find-message/FindMessageOutput';
import { UpdateMessageHandler } from 'application/usecases/message/update-message/UpdateMessageHandler';
import { UpdateMessageInput } from 'application/usecases/message/update-message/UpdateMessageInput';
import { UpdateMessageOutput } from 'application/usecases/message/update-message/UpdateMessageOutput';
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/chats/messages')
export class MessageController {
    constructor(
        private readonly _findMessageHandler: FindMessageHandler,
        private readonly _createMessageHandler: CreateMessageHandler,
        private readonly _updateMessageHandler: UpdateMessageHandler,
        private readonly _deleteMessageHandler: DeleteMessageHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({ summary: 'Find message' })
    @ResponseSchema(FindMessageOutput)
    async find(@QueryParams() param: FindMessageInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<FindMessageOutput> {
        return await this._findMessageHandler.handle(param, usecaseOption);
    }

    @Post('/')
    @Authorized()
    @OpenAPI({ summary: 'Create message' })
    @ResponseSchema(CreateMessageOutput)
    async create(@Body() param: CreateMessageInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<CreateMessageOutput> {
        return await this._createMessageHandler.handle(param, usecaseOption);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Update message' })
    @ResponseSchema(UpdateMessageOutput)
    async update(@Param('id') id: string, @Body() param: UpdateMessageInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<UpdateMessageOutput> {
        return await this._updateMessageHandler.handle(id, param, usecaseOption);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Delete message' })
    @ResponseSchema(DeleteMessageOutput)
    async delete(@Param('id') id: string, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<DeleteMessageOutput> {
        return await this._deleteMessageHandler.handle(id, usecaseOption);
    }
}
