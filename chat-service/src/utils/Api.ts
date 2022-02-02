/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ILogService } from 'application/interfaces/services/ILogService';
import { AxiosResponse } from 'axios';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { TraceRequest } from 'shared/request/TraceRequest';

/**
 * Handle axios response data
 */
export function handleAxiosResponseData<T>(logService: ILogService, trace: TraceRequest, res: AxiosResponse<T>): T {
    if (!res.data) {
        logService.error('Data response is invalid', {
            baseURL: res.config.baseURL,
            url: res.config.url,
            method: res.config.method
        }, trace);
        throw new LogicalError(MessageError.SOMETHING_WRONG);
    }
    return res.data;
}

/**
 * Handle axios response error
 */
export function handleAxiosResponseError(logService: ILogService, trace: TraceRequest, error: { config: { baseURL: string, url: string, method: string }, message: string, response?: { status: number, data: object } }): any {
    if (!error.response) {
        logService.error(error.message, {
            baseURL: error.config.baseURL,
            url: error.config.url,
            method: error.config.method
        }, trace);
        throw new LogicalError(MessageError.SOMETHING_WRONG);
    }

    // eslint-disable-next-line no-throw-literal
    throw {
        httpCode: error.response.status,
        ...error.response.data
    };
}
