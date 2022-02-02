import { UploadAvatarHandler } from 'application/usecases/user/upload-avatar/UploadAvatarHandler';
import { UploadAvatarInput } from 'application/usecases/user/upload-avatar/UploadAvatarInput';
import { UploadAvatarOutput } from 'application/usecases/user/upload-avatar/UploadAvatarOutput';
import { STORAGE_UPLOAD_DIR } from 'config/Configuration';
import { PrivateAccessMiddleware } from 'exposes/api/web/middlewares/PrivateAccessMiddleware';
import multer from 'multer';
import { Get, JsonController, UseBefore, UploadedFile, Post, Authorized, CurrentUser } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, STORAGE_UPLOAD_DIR);
    },
    filename(_req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

@Service()
@JsonController('/v1/accounts')
export class UserController {
    constructor(
        private readonly _uploadAvatarHandler: UploadAvatarHandler
    ) {}

    @Post('/avatar')
    @Authorized()
    @OpenAPI({ summary: 'Upload avatar' })
    @ResponseSchema(UploadAvatarOutput)
    uploadAvatar(@UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<UploadAvatarOutput> {
        const param = new UploadAvatarInput();
        param.file = file;
        return this._uploadAvatarHandler.handle(userAuth.userId, param, usecaseOption);
    }

    @Get('/api-private')
    @UseBefore(PrivateAccessMiddleware)
    testApiPrivate(): Promise<{data: boolean}> {
        return Promise.resolve({ data: true });
    }
}
