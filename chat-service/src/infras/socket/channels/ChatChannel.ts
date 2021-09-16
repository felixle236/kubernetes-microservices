import { AUTH_URL } from '@configs/Configuration';
import { RoleId } from '@domain/enums/user/RoleId';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { ISocket } from '@shared/socket/interfaces/ISocket';
import { ChatNS } from '@shared/socket/namespaces/ChatNS';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { UpdateUserOnlineStatusCommandHandler } from '@usecases/user/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';
import { UpdateUserOnlineStatusCommandInput } from '@usecases/user/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandInput';
import { sendAll } from '@utils/socket';
import axios from 'axios';
import { Server } from 'socket.io';
import { Service } from 'typedi';

@Service()
export default class ChatChannel {
    constructor(
        private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler
    ) {}

    init(io: Server): void {
        const nsp = io.of('/' + ChatNS.NAME);

        // Ensure the socket is authorized
        nsp.use(async (socket: ISocket, next: (err?: Error) => void) => {
            try {
                const token = (socket.handshake.auth as {token: string}).token;
                const { data } = await axios.post(`${AUTH_URL}/api/v1/auths?token=${token}`);
                if (!data || !data.data)
                    throw new SystemError(MessageError.PARAM_INVALID, 'token');
                socket.userAuth = new UserAuthenticated(data.data.userId, data.data.roleId);
                next();
            }
            catch (error: any) {
                next(error);
            }
        });

        nsp.on('connection', async (socket: ISocket) => {
            const userAuth = socket.userAuth as UserAuthenticated;
            const param = new UpdateUserOnlineStatusCommandInput();
            param.isOnline = true;
            param.onlineAt = new Date();

            const result = await this._updateUserOnlineStatusCommandHandler.handle(userAuth.userId, param);
            if (result.data && userAuth.roleId !== RoleId.SuperAdmin) {
                sendAll(socket, ChatNS.EVENTS.ONLINE_STATUS_CHANGED, {
                    userId: userAuth.userId,
                    ...param
                });
            }

            socket.join(userAuth.roleId);
            socket.join(userAuth.userId);

            socket.on('disconnecting', async () => {
                const param = new UpdateUserOnlineStatusCommandInput();
                param.isOnline = false;
                param.onlineAt = new Date();

                const result = await this._updateUserOnlineStatusCommandHandler.handle(userAuth.userId, param);
                if (result.data && userAuth.roleId !== RoleId.SuperAdmin) {
                    sendAll(socket, ChatNS.EVENTS.ONLINE_STATUS_CHANGED, {
                        userId: userAuth.userId,
                        ...param
                    });
                }
            });

            socket.on('disconnect', () => {
                socket.leave(userAuth.roleId);
                socket.leave(userAuth.userId);
            });
        });
    }
}
