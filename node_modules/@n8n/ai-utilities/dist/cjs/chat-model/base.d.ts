import type { ChatModel, ChatModelConfig } from '../types/chat-model';
import type { Message } from '../types/message';
import type { GenerateResult, StreamChunk } from '../types/output';
import type { Tool } from '../types/tool';
export declare abstract class BaseChatModel<TConfig extends ChatModelConfig = ChatModelConfig> implements ChatModel<TConfig> {
    provider: string;
    modelId: string;
    defaultConfig?: TConfig | undefined;
    protected tools: Tool[];
    constructor(provider: string, modelId: string, defaultConfig?: TConfig | undefined, tools?: Tool[]);
    abstract generate(messages: Message[], config?: TConfig): Promise<GenerateResult>;
    abstract stream(messages: Message[], config?: TConfig): AsyncIterable<StreamChunk>;
    withTools(tools: Tool[]): ChatModel<TConfig>;
    protected mergeConfig(config?: TConfig): ChatModelConfig;
}
