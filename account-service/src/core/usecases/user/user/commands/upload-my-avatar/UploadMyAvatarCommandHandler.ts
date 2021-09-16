import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IQueueContext } from '@shared/queue/interfaces/IQueueContext';
import { UserExchange } from '@shared/queue/provide/exchanges/UserExchange';
import { IChatUpdateUserAvatarPayload } from '@shared/queue/provide/payloads/chat/IChatUpdateUserAvatarPayload';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { removeFile } from '@utils/file';
import { validateDataInput } from '@utils/validator';
import mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { UploadMyAvatarCommandInput } from './UploadMyAvatarCommandInput';
import { UploadMyAvatarCommandOutput } from './UploadMyAvatarCommandOutput';

@Service()
export class UploadMyAvatarCommandHandler extends CommandHandler<UploadMyAvatarCommandInput, UploadMyAvatarCommandOutput> {
    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('queue.context')
    private readonly _queueContext: IQueueContext;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(id: string, param: UploadMyAvatarCommandInput, handleOption: HandleOption): Promise<UploadMyAvatarCommandOutput> {
        await validateDataInput(param);

        const file = param.file;
        const ext = mime.extension(file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

        User.validateAvatarFile(file);
        const avatarPath = User.getAvatarPath(id, ext);
        const data = new User();
        data.avatar = avatarPath;

        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            await this._userRepository.update(id, data, queryRunner);

            const hasSucceed = await this._storageService.upload(avatarPath, file.path, { mimetype: file.mimetype, size: file.size })
                .finally(() => removeFile(file.path));
            if (!hasSucceed)
                throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar');

            const payload: IChatUpdateUserAvatarPayload = {
                id,
                avatar: data.avatar
            };
            this._queueContext.publish(UserExchange.EXCHANGE, UserExchange.KEYS.USER_EVENT_AVATAR_UPDATED, payload, {}, handleOption);

            const result = new UploadMyAvatarCommandOutput();
            result.setData(data.avatar || '');
            return result;
        });
    }
}
