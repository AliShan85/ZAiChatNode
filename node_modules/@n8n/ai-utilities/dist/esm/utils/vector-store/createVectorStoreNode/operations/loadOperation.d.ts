import type { Embeddings } from '@langchain/core/embeddings';
import type { VectorStore } from '@langchain/core/vectorstores';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import type { VectorStoreNodeConstructorArgs } from '../types';
export declare function handleLoadOperation<T extends VectorStore = VectorStore>(context: IExecuteFunctions, args: VectorStoreNodeConstructorArgs<T>, embeddings: Embeddings, itemIndex: number): Promise<INodeExecutionData[]>;
