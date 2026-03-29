import * as LangchainMessages from '@langchain/core/messages';
import type * as N8nMessages from '../types/message';
import type { Message } from '../types/message';
export declare function fromLcContent(content: string | LangchainMessages.ContentBlock | LangchainMessages.ContentBlock[]): N8nMessages.MessageContent[];
export declare function fromLcMessage(msg: LangchainMessages.BaseMessage): N8nMessages.Message;
export declare function toLcContent(block: N8nMessages.MessageContent): LangchainMessages.ContentBlock;
export declare function toLcMessage(message: Message): LangchainMessages.BaseMessage;
