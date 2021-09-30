import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { MessagePropertyHeaders } from 'amqplib';

export class TraceRequest {
    static HTTP_HEADER_KEY = 'x-trace';
    static MQ_HEADER_KEY = 'trace';

    id: string;

    getFromHttpHeader(headers: IncomingHttpHeaders): void {
        if (!headers[TraceRequest.HTTP_HEADER_KEY])
            headers[TraceRequest.HTTP_HEADER_KEY] = randomUUID();
        this.id = headers[TraceRequest.HTTP_HEADER_KEY] as string;
    }

    setToHttpHeader(headers: IncomingHttpHeaders): void {
        headers[TraceRequest.HTTP_HEADER_KEY] = this.id || randomUUID();
    }

    getFromMQHeader(headers: MessagePropertyHeaders): void {
        if (!headers[TraceRequest.MQ_HEADER_KEY])
            headers[TraceRequest.MQ_HEADER_KEY] = randomUUID();
        this.id = headers[TraceRequest.MQ_HEADER_KEY];
    }

    setToMQHeader(headers: MessagePropertyHeaders): void {
        headers[TraceRequest.MQ_HEADER_KEY] = this.id || randomUUID();
    }
}
