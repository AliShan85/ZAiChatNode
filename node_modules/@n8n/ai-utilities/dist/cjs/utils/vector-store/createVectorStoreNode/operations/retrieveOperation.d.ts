import type { Embeddings } from '@langchain/core/embeddings';
import type { VectorStore } from '@langchain/core/vectorstores';
import type { ISupplyDataFunctions, SupplyData } from 'n8n-workflow';
import type { VectorStoreNodeConstructorArgs } from '../types';
export declare function handleRetrieveOperation<T extends VectorStore = VectorStore>(context: ISupplyDataFunctions, args: VectorStoreNodeConstructorArgs<T>, embeddings: Embeddings, itemIndex: number): Promise<SupplyData>;
