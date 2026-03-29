export interface ServerSentEventMessage {
    comment?: string;
    event?: string;
    data?: string;
    id?: string | number;
    retry?: number;
}
export declare function parseSSEStream(body: AsyncIterableIterator<Buffer | Uint8Array>): AsyncIterable<ServerSentEventMessage>;
