import type { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import type { Document } from '@langchain/core/documents';
export interface MemoryVectorStoreConfig {
    maxMemoryMB: number;
    ttlHours: number;
}
export interface VectorStoreMetadata {
    size: number;
    createdAt: Date;
    lastAccessed: Date;
}
export interface StoreStats {
    sizeBytes: number;
    sizeMB: number;
    percentOfTotal: number;
    vectors: number;
    createdAt: string;
    lastAccessed: string;
    inactive?: boolean;
    inactiveForHours?: number;
}
export interface VectorStoreStats {
    totalSizeBytes: number;
    totalSizeMB: number;
    percentOfLimit: number;
    maxMemoryMB: number;
    storeCount: number;
    inactiveStoreCount: number;
    ttlHours: number;
    stores: Record<string, StoreStats>;
}
export interface IMemoryCalculator {
    estimateBatchSize(documents: Document[]): number;
    calculateVectorStoreSize(vectorStore: MemoryVectorStore): number;
}
export interface IStoreCleanupService {
    cleanupInactiveStores(): void;
    cleanupOldestStores(requiredBytes: number): void;
}
