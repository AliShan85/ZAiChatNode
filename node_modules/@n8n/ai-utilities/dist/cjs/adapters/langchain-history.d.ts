import { BaseListChatMessageHistory } from '@langchain/core/chat_history';
import type { BaseMessage } from '@langchain/core/messages';
import type { ChatHistory } from '../types/memory';
export declare class LangchainHistoryAdapter extends BaseListChatMessageHistory {
    private readonly history;
    lc_namespace: string[];
    constructor(history: ChatHistory);
    getMessages(): Promise<BaseMessage[]>;
    addMessage(message: BaseMessage): Promise<void>;
    addMessages(messages: BaseMessage[]): Promise<void>;
    clear(): Promise<void>;
}
