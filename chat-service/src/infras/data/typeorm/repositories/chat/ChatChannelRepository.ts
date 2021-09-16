import { ChatChannel } from '@domain/entities/chat/ChatChannel';
import { IChatChannelRepository } from '@gateways/repositories/chat/IChatChannelRepository';
import { Service } from 'typedi';
import { ChatChannelDb } from '../../entities/chat/ChatChannelDb';
import { CHAT_CHANNEL_SCHEMA } from '../../schemas/chat/ChatChannelSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('chat_channel.repository')
export class ChatChannelRepository extends BaseRepository<string, ChatChannel, ChatChannelDb> implements IChatChannelRepository {
    constructor() {
        super(ChatChannelDb, CHAT_CHANNEL_SCHEMA);
    }
}
