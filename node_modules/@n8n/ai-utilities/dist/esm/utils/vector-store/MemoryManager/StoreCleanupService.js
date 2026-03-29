"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreCleanupService = void 0;
class StoreCleanupService {
    constructor(maxMemorySizeBytes, inactiveTtlMs, vectorStores, storeMetadata, onCleanup) {
        this.maxMemorySizeBytes = maxMemorySizeBytes;
        this.inactiveTtlMs = inactiveTtlMs;
        this.vectorStores = vectorStores;
        this.storeMetadata = storeMetadata;
        this.onCleanup = onCleanup;
        this.oldestStoreKeys = [];
        this.lastSortTime = 0;
        this.CACHE_TTL_MS = 5000;
    }
    isStoreInactive(metadata) {
        if (this.inactiveTtlMs <= 0) {
            return false;
        }
        const now = Date.now();
        const lastAccessedTime = metadata.lastAccessed.getTime();
        return now - lastAccessedTime > this.inactiveTtlMs;
    }
    cleanupInactiveStores() {
        if (this.inactiveTtlMs <= 0) {
            return;
        }
        let freedBytes = 0;
        const removedStores = [];
        for (const [key, metadata] of this.storeMetadata.entries()) {
            if (this.isStoreInactive(metadata)) {
                this.vectorStores.delete(key);
                freedBytes += metadata.size;
                removedStores.push(key);
            }
        }
        for (const key of removedStores) {
            this.storeMetadata.delete(key);
        }
        if (removedStores.length > 0) {
            this.oldestStoreKeys = [];
            this.onCleanup(removedStores, freedBytes, 'ttl');
        }
    }
    cleanupOldestStores(requiredBytes) {
        if (this.maxMemorySizeBytes <= 0) {
            return;
        }
        let currentMemoryUsage = 0;
        for (const metadata of this.storeMetadata.values()) {
            currentMemoryUsage += metadata.size;
        }
        this.cleanupInactiveStores();
        currentMemoryUsage = 0;
        for (const metadata of this.storeMetadata.values()) {
            currentMemoryUsage += metadata.size;
        }
        if (currentMemoryUsage + requiredBytes <= this.maxMemorySizeBytes) {
            return;
        }
        const now = Date.now();
        if (this.oldestStoreKeys.length === 0 || now - this.lastSortTime > this.CACHE_TTL_MS) {
            const stores = [];
            for (const [key, metadata] of this.storeMetadata.entries()) {
                stores.push([key, metadata.createdAt.getTime()]);
            }
            stores.sort((a, b) => a[1] - b[1]);
            this.oldestStoreKeys = stores.map(([key]) => key);
            this.lastSortTime = now;
        }
        let freedBytes = 0;
        const removedStores = [];
        for (const key of this.oldestStoreKeys) {
            if (!this.storeMetadata.has(key))
                continue;
            if (currentMemoryUsage - freedBytes + requiredBytes <= this.maxMemorySizeBytes) {
                break;
            }
            const metadata = this.storeMetadata.get(key);
            if (metadata) {
                this.vectorStores.delete(key);
                freedBytes += metadata.size;
                removedStores.push(key);
            }
        }
        for (const key of removedStores) {
            this.storeMetadata.delete(key);
        }
        if (removedStores.length > 0) {
            this.oldestStoreKeys = this.oldestStoreKeys.filter((key) => !removedStores.includes(key));
            this.onCleanup(removedStores, freedBytes, 'memory');
        }
    }
}
exports.StoreCleanupService = StoreCleanupService;
//# sourceMappingURL=StoreCleanupService.js.map