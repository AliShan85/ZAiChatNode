import type { Message } from './message';
import type { GenerateResult, StreamChunk } from './output';
import type { Tool } from './tool';
export interface ChatModelConfig {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    stopSequences?: string[];
    seed?: number;
    maxRetries?: number;
    timeout?: number;
    abortSignal?: AbortSignal;
    headers?: Record<string, string | undefined>;
}
export interface ChatModel<TConfig extends ChatModelConfig = ChatModelConfig> {
    provider: string;
    modelId: string;
    defaultConfig?: TConfig;
    generate(messages: Message[], config?: TConfig): Promise<GenerateResult>;
    stream(messages: Message[], config?: TConfig): AsyncIterable<StreamChunk>;
    withTools(tools: Tool[]): ChatModel<TConfig>;
    withStructuredOutput?(schema: Record<string, unknown>): ChatModel<TConfig>;
}
