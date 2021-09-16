import { ChatChannel } from '@domain/entities/chat/ChatChannel';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export interface IChatChannelRepository extends IBaseRepository<string, ChatChannel> {

}
