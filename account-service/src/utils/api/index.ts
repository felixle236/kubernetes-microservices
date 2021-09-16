/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { AxiosResponse } from 'axios';

/**
 * Handle axios response data
 */
export function handleAxiosResponseData<T>(res: AxiosResponse<T>): T {
    if (!res.data)
        throw new SystemError(MessageError.SOMETHING_WRONG);

    return res.data;
}

/**
 * Handle axios response error
 */
export function handleAxiosResponseError(error: any): any {
    if (!error.response)
        throw new SystemError(MessageError.SOMETHING_WRONG);

    // eslint-disable-next-line no-throw-literal
    throw {
        httpCode: error.response.status,
        ...error.response.data
    };
}
