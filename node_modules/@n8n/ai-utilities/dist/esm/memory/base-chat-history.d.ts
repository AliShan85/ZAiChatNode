import type { ChatHistory } from '../types/memory';
import type { Message } from '../types/message';
export declare abstract class BaseChatHistory implements ChatHistory {
    abstract getMessages(): Promise<Message[]>;
    abstract addMessage(message: Message): Promise<void>;
    addMessages(messages: Message[]): Promise<void>;
    abstract clear(): Promise<void>;
}
