import type { BaseDocumentLoader } from '@langchain/classic/dist/document_loaders/base';
import type { BaseChatMemory } from '@langchain/community/memory/chat_memory';
import type { BaseChatMessageHistory } from '@langchain/core/chat_history';
import type { Document } from '@langchain/core/documents';
import { Embeddings } from '@langchain/core/embeddings';
import { BaseRetriever } from '@langchain/core/retrievers';
import { BaseDocumentCompressor } from '@langchain/core/retrievers/document_compressors';
import type { StructuredTool, Tool } from '@langchain/core/tools';
import { VectorStore } from '@langchain/core/vectorstores';
import { TextSplitter } from '@langchain/textsplitters';
import type { IExecuteFunctions, ISupplyDataFunctions, NodeConnectionType } from 'n8n-workflow';
import { N8nBinaryLoader } from './n8n-binary-loader';
import { N8nJsonLoader } from './n8n-json-loader';
export declare function callMethodAsync<T>(this: T, parameters: {
    executeFunctions: IExecuteFunctions | ISupplyDataFunctions;
    connectionType: NodeConnectionType;
    currentNodeRunIndex: number;
    method: (...args: any[]) => Promise<unknown>;
    arguments: unknown[];
}): Promise<unknown>;
export declare function callMethodSync<T>(this: T, parameters: {
    executeFunctions: IExecuteFunctions;
    connectionType: NodeConnectionType;
    currentNodeRunIndex: number;
    method: (...args: any[]) => T;
    arguments: unknown[];
}): unknown;
export declare function logWrapper<T extends Tool | StructuredTool | BaseChatMemory | BaseChatMessageHistory | BaseRetriever | BaseDocumentCompressor | Embeddings | Document[] | Document | BaseDocumentLoader | TextSplitter | VectorStore | N8nBinaryLoader | N8nJsonLoader>(originalInstance: T, executeFunctions: IExecuteFunctions | ISupplyDataFunctions): T;
