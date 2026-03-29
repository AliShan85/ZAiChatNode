import type { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import type { Document } from '@langchain/core/documents';
import type { IMemoryCalculator } from './types';
export declare class MemoryCalculator implements IMemoryCalculator {
    estimateBatchSize(documents: Document[]): number;
    calculateVectorStoreSize(vectorStore: MemoryVectorStore): number;
}
