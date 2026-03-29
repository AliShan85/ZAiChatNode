import type { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import type { VectorStoreMetadata, IStoreCleanupService } from './types';
export declare class StoreCleanupService implements IStoreCleanupService {
    private readonly maxMemorySizeBytes;
    private readonly inactiveTtlMs;
    private readonly vectorStores;
    private readonly storeMetadata;
    private readonly onCleanup;
    private oldestStoreKeys;
    private lastSortTime;
    private readonly CACHE_TTL_MS;
    constructor(maxMemorySizeBytes: number, inactiveTtlMs: number, vectorStores: Map<string, MemoryVectorStore>, storeMetadata: Map<string, VectorStoreMetadata>, onCleanup: (removedKeys: string[], freedBytes: number, reason: 'ttl' | 'memory') => void);
    isStoreInactive(metadata: VectorStoreMetadata): boolean;
    cleanupInactiveStores(): void;
    cleanupOldestStores(requiredBytes: number): void;
}
