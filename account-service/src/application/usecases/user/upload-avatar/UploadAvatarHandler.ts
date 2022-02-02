import { User } from 'domain/entities/User';
import { ClientStatus } from 'domain/enums/ClientStatus';
import { ManagerStatus } from 'domain/enums/ManagerStatus';
import { RoleId } from 'domain/enums/RoleId';
import { IClientRepository } from 'application/interfaces/repositories/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/IManagerRepository';
import { IUserRepository } from 'application/interfaces/repositories/IUserRepository';
import { IRabbitMQService } from 'application/interfaces/services/IRabbitMQService';
import { IStorageService } from 'application/interfaces/services/IStorageService';
import mime from 'mime-types';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { removeFile } from 'utils/File';
import { UploadAvatarInput } from './UploadAvatarInput';
import { UploadAvatarOutput } from './UploadAvatarOutput';

@Service()
export class UploadAvatarHandler implements IUsecaseHandler<UploadAvatarInput, UploadAvatarOutput> {
    constructor(
        @Inject(InjectService.RabbitMQService) private readonly _rabbitMQService: IRabbitMQService,
        @Inject(InjectService.Storage) private readonly _storageService: IStorageService,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string, param: UploadAvatarInput, usecaseOption: UsecaseOption): Promise<UploadAvatarOutput> {
        const file = param.file;
        const ext = mime.extension(file.mimetype);
        if (!ext)
            throw new LogicalError(MessageError.PARAM_INVALID, { t: 'avatar' });

        User.validateAvatarFile(file);
        const avatarPath = `users/${id}/images/avatar.${ext}`;

        const user = await this._userRepository.get(id);
        if (!user)
            throw new NotFoundError();

        let hasSucceed = await this._storageService.upload(avatarPath, file.path, { mimetype: file.mimetype, size: file.size })
            .finally(() => removeFile(file.path));
        if (!hasSucceed)
            throw new LogicalError(MessageError.PARAM_CANNOT_UPLOAD, { t: 'avatar' });

        const avatar = this._storageService.mapUrl(avatarPath);
        const data = new User();
        data.avatar = avatar;

        hasSucceed = await this._userRepository.update(id, data);
        if (hasSucceed) {
            let status: ClientStatus | ManagerStatus = ClientStatus.Actived;
            if (user.roleId === RoleId.Client) {
                const client = await this._clientRepository.get(id);
                if (client)
                    status = client.status;
            }
            else {
                const manager = await this._managerRepository.get(id);
                if (manager)
                    status = manager.status;
            }

            this._rabbitMQService.publishAccountEventUserUpdated({
                id,
                status: status,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar
            }, usecaseOption);
        }

        const result = new UploadAvatarOutput();
        result.data = avatar;
        return result;
    }
}
