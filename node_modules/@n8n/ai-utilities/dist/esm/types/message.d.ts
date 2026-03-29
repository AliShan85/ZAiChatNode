export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';
export type MessageContent = ContentText | ContentToolCall | ContentInvalidToolCall | ContentToolResult | ContentReasoning | ContentFile | ContentCitation | ContentProvider;
export interface ContentMetadata {
    providerMetadata?: Record<string, unknown>;
}
export type ContentCitation = ContentMetadata & {
    type: 'citation';
    source?: string;
    url?: string;
    title?: string;
    startIndex?: number;
    endIndex?: number;
    text?: string;
};
export type ContentText = ContentMetadata & {
    type: 'text';
    text: string;
};
export type ContentReasoning = ContentMetadata & {
    type: 'reasoning';
    text: string;
};
export type ContentFile = ContentMetadata & {
    type: 'file';
    mediaType?: string;
    data: string | Uint8Array;
};
export type ContentToolCall = ContentMetadata & {
    type: 'tool-call';
    toolCallId?: string;
    toolName: string;
    input: string;
};
export type ContentToolResult = ContentMetadata & {
    type: 'tool-result';
    toolCallId: string;
    result: any;
    isError?: boolean;
};
export type ContentInvalidToolCall = ContentMetadata & {
    type: 'invalid-tool-call';
    toolCallId?: string;
    error?: string;
    args?: string;
    name?: string;
};
export type ContentProvider = ContentMetadata & {
    type: 'provider';
    value: Record<string, unknown>;
};
export interface Message {
    role: MessageRole;
    content: MessageContent[];
    name?: string;
    id?: string;
}
