import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { BindToolsInput } from '@langchain/core/language_models/chat_models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { BaseMessage } from '@langchain/core/messages';
import { AIMessageChunk } from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import type { Runnable } from '@langchain/core/runnables';
import type { ISupplyDataFunctions } from 'n8n-workflow';
import type { ChatModel, ChatModelConfig } from '../types/chat-model';
export declare class LangchainChatModelAdapter<CallOptions extends ChatModelConfig = ChatModelConfig> extends BaseChatModel<CallOptions> {
    private chatModel;
    private ctx?;
    constructor(chatModel: ChatModel, ctx?: ISupplyDataFunctions | undefined);
    _llmType(): string;
    _generate(messages: BaseMessage[], options: this['ParsedCallOptions']): Promise<ChatResult>;
    _streamResponseChunks(messages: BaseMessage[], options: this['ParsedCallOptions'], runManager?: CallbackManagerForLLMRun): AsyncGenerator<ChatGenerationChunk>;
    bindTools(tools: BindToolsInput[]): Runnable<BaseLanguageModelInput, AIMessageChunk, CallOptions>;
}
