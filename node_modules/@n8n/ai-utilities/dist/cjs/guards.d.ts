import type { BaseChatMemory } from '@langchain/classic/memory';
import type { BaseChatMessageHistory } from '@langchain/core/chat_history';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { Tool } from '@langchain/core/tools';
export declare function isBaseChatMemory(obj: unknown): obj is BaseChatMemory;
export declare function isBaseChatMessageHistory(obj: unknown): obj is BaseChatMessageHistory;
export declare function isChatInstance(model: unknown): model is BaseChatModel;
export declare function isToolsInstance(model: unknown): model is Tool;
