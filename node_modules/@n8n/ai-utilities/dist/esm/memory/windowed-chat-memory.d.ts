import { BaseChatMemory } from './base-chat-memory';
import type { ChatHistory } from '../types/memory';
import type { Message } from '../types/message';
export interface WindowedChatMemoryConfig {
    windowSize?: number;
}
export declare class WindowedChatMemory extends BaseChatMemory {
    readonly chatHistory: ChatHistory;
    private readonly windowSize;
    constructor(chatHistory: ChatHistory, config?: WindowedChatMemoryConfig);
    loadMessages(): Promise<Message[]>;
    saveTurn(input: string, output: string): Promise<void>;
    clear(): Promise<void>;
}
