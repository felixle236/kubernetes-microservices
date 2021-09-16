import { HandleOptionRequest } from '@shared/decorators/HandleOptionRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { ArchiveChatChannelUserCommandHandler } from '@usecases/chat/chat-channel-user/commands/archive-chat-channel-user/ArchiveChatChannelUserCommandHandler';
import { ArchiveChatChannelUserCommandInput } from '@usecases/chat/chat-channel-user/commands/archive-chat-channel-user/ArchiveChatChannelUserCommandInput';
import { ArchiveChatChannelUserCommandOutput } from '@usecases/chat/chat-channel-user/commands/archive-chat-channel-user/ArchiveChatChannelUserCommandOutput';
import { FindChatChannelUserQueryHandler } from '@usecases/chat/chat-channel-user/queries/find-chat-channel-user/FindChatChannelUserQueryHandler';
import { FindChatChannelUserQueryOutput } from '@usecases/chat/chat-channel-user/queries/find-chat-channel-user/FindChatChannelUserQueryOutput';
import { CreateChatChannelCommandHandler } from '@usecases/chat/chat-channel/commands/create-chat-channel/CreateChatChannelCommandHandler';
import { CreateChatChannelCommandInput } from '@usecases/chat/chat-channel/commands/create-chat-channel/CreateChatChannelCommandInput';
import { CreateChatChannelCommandOutput } from '@usecases/chat/chat-channel/commands/create-chat-channel/CreateChatChannelCommandOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Params, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/chat-channels')
export class ChatChannelController {
    constructor(
        private readonly _findChatChannelUserQueryHandler: FindChatChannelUserQueryHandler,
        private readonly _createChatChannelCommandHandler: CreateChatChannelCommandHandler,
        private readonly _archiveChatChannelUserCommandHandler: ArchiveChatChannelUserCommandHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({ summary: 'Find channels' })
    @ResponseSchema(FindChatChannelUserQueryOutput)
    async find(@CurrentUser() userAuth: UserAuthenticated): Promise<FindChatChannelUserQueryOutput> {
        return await this._findChatChannelUserQueryHandler.handle(userAuth.userId);
    }

    @Post('/')
    @Authorized()
    @OpenAPI({ summary: 'Create channel' })
    @ResponseSchema(CreateChatChannelCommandOutput)
    async create(@Body() param: CreateChatChannelCommandInput, @HandleOptionRequest() handleOption: HandleOption): Promise<CreateChatChannelCommandOutput> {
        return await this._createChatChannelCommandHandler.handle(param, handleOption);
    }

    @Delete('/:channelId([0-9a-f-]{36})')
    @Authorized()
    @OpenAPI({ summary: 'Delete channel' })
    @ResponseSchema(ArchiveChatChannelUserCommandOutput)
    async delete(@Params() param: ArchiveChatChannelUserCommandInput, @HandleOptionRequest() handleOption: HandleOption): Promise<ArchiveChatChannelUserCommandOutput> {
        return await this._archiveChatChannelUserCommandHandler.handle(param, handleOption);
    }
}
