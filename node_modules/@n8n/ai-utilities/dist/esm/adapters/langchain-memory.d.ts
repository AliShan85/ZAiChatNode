import { BaseChatMemory as LangchainBaseChatMemory } from '@langchain/community/memory/chat_memory';
import type { InputValues, MemoryVariables, OutputValues } from '@langchain/core/memory';
import type { ChatMemory } from '../types/memory';
export declare class LangchainMemoryAdapter extends LangchainBaseChatMemory {
    private readonly memory;
    constructor(memory: ChatMemory);
    get memoryKeys(): string[];
    loadMemoryVariables(_values: InputValues): Promise<MemoryVariables>;
    saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void>;
    clear(): Promise<void>;
}
