import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { IRequest } from '@shared/request/IRequest';
import { TraceRequest } from '@shared/request/TraceRequest';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { Response } from 'express';

export class HandleOption {
    req: IRequest;
    res: Response;
    trace: TraceRequest;
    userAuth: UserAuthenticated | null;
    queryRunner: IDbQueryRunner | null;
}
