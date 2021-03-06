import { RoleId } from 'domain/enums/RoleId';
import { IAuthenticationService } from 'application/interfaces/services/IAuthenticationService';
import { UpdateUserOnlineStatusHandler } from 'application/usecases/user/update-user-online-status/UpdateUserOnlineStatusHandler';
import { UpdateUserOnlineStatusInput } from 'application/usecases/user/update-user-online-status/UpdateUserOnlineStatusInput';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { TraceRequest } from 'shared/request/TraceRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { ISocket } from 'shared/socket/interfaces/ISocket';
import { ChatNS } from 'shared/socket/namespaces/ChatNS';
import { InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Server } from 'socket.io';
import { Inject, Service } from 'typedi';
import { sendAll } from 'utils/Socket';

@Service()
export default class ChatChannel {
    constructor(
        private readonly _updateUserOnlineStatusHandler: UpdateUserOnlineStatusHandler,
        @Inject(InjectService.Auth) private readonly _authenticationService: IAuthenticationService
    ) {}

    init(io: Server): void {
        const nsp = io.of('/' + ChatNS.NAME);

        // Ensure the socket is authorized
        nsp.use(async (socket: ISocket, next: (err?: Error) => void) => {
            try {
                const token = (socket.handshake.auth as {token: string}).token;
                const usecaseOption = new UsecaseOption();
                usecaseOption.trace = new TraceRequest();
                usecaseOption.trace.getFromSocket(socket);

                const data = await this._authenticationService.verifyUserAuth(token, usecaseOption);
                if (!data.userId || !data.roleId || !data.type)
                    throw new LogicalError(MessageError.PARAM_INVALID, 'token');

                socket.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
                next();
            }
            catch (error: any) {
                next(error);
            }
        });

        nsp.on('connection', async (socket: ISocket) => {
            const userAuth = socket.userAuth as UserAuthenticated;
            const param = new UpdateUserOnlineStatusInput();
            param.isOnline = true;
            param.onlineAt = new Date();

            const result = await this._updateUserOnlineStatusHandler.handle(userAuth.userId, param);
            if (result.data && userAuth.roleId !== RoleId.SuperAdmin) {
                sendAll(socket, ChatNS.EVENTS.ONLINE_STATUS_CHANGED, {
                    userId: userAuth.userId,
                    ...param
                });
            }

            socket.join(userAuth.roleId);
            socket.join(userAuth.userId);

            socket.on('disconnecting', async () => {
                const param = new UpdateUserOnlineStatusInput();
                param.isOnline = false;
                param.onlineAt = new Date();

                const result = await this._updateUserOnlineStatusHandler.handle(userAuth.userId, param);
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
