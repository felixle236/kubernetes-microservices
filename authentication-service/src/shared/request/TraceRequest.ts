import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { MessagePropertyHeaders } from 'amqplib';
import { HttpHeaderKey, QueueHeaderKey } from 'shared/types/Common';

export class TraceRequest {
    id: string;

    getFromHttpHeader(headers: IncomingHttpHeaders): void {
        if (!headers[HttpHeaderKey.Trace])
            headers[HttpHeaderKey.Trace] = randomUUID();
        this.id = headers[HttpHeaderKey.Trace] as string;
    }

    setToHttpHeader(headers: IncomingHttpHeaders): void {
        headers[HttpHeaderKey.Trace] = this.id || randomUUID();
    }

    getFromMQHeader(headers: MessagePropertyHeaders): void {
        if (!headers[QueueHeaderKey.Trace])
            headers[QueueHeaderKey.Trace] = randomUUID();
        this.id = headers[QueueHeaderKey.Trace];
    }

    setToMQHeader(headers: MessagePropertyHeaders): void {
        headers[QueueHeaderKey.Trace] = this.id || randomUUID();
    }
}
