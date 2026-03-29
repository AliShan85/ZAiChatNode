(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/classic/vectorstores/memory", "./config", "./MemoryCalculator", "./StoreCleanupService"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MemoryVectorStoreManager = void 0;
    const memory_1 = require("@langchain/classic/vectorstores/memory");
    const config_1 = require("./config");
    const MemoryCalculator_1 = require("./MemoryCalculator");
    const StoreCleanupService_1 = require("./StoreCleanupService");
    class MemoryVectorStoreManager {
        constructor(embeddings, logger) {
            this.embeddings = embeddings;
            this.logger = logger;
            this.memoryUsageBytes = 0;
            this.ttlCleanupIntervalId = null;
            this.vectorStoreBuffer = new Map();
            this.storeMetadata = new Map();
            this.logger = logger;
            const config = (0, config_1.getConfig)();
            this.maxMemorySizeBytes = (0, config_1.mbToBytes)(config.maxMemoryMB);
            this.inactiveTtlMs = (0, config_1.hoursToMs)(config.ttlHours);
            this.memoryCalculator = new MemoryCalculator_1.MemoryCalculator();
            this.cleanupService = new StoreCleanupService_1.StoreCleanupService(this.maxMemorySizeBytes, this.inactiveTtlMs, this.vectorStoreBuffer, this.storeMetadata, this.handleCleanup.bind(this));
            this.setupTtlCleanup();
        }
        static getInstance(embeddings, logger) {
            if (!MemoryVectorStoreManager.instance) {
                MemoryVectorStoreManager.instance = new MemoryVectorStoreManager(embeddings, logger);
            }
            else {
                MemoryVectorStoreManager.instance.embeddings = embeddings;
                MemoryVectorStoreManager.instance.vectorStoreBuffer.forEach((vectorStoreInstance) => {
                    vectorStoreInstance.embeddings = embeddings;
                });
            }
            return MemoryVectorStoreManager.instance;
        }
        setupTtlCleanup() {
            if (this.inactiveTtlMs <= 0) {
                return;
            }
            const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
            if (this.ttlCleanupIntervalId) {
                clearInterval(this.ttlCleanupIntervalId);
            }
            this.ttlCleanupIntervalId = setInterval(() => {
                this.cleanupService.cleanupInactiveStores();
            }, CLEANUP_INTERVAL_MS);
        }
        handleCleanup(removedKeys, freedBytes, reason) {
            this.memoryUsageBytes -= freedBytes;
            if (reason === 'ttl') {
                const ttlHours = Math.round(this.inactiveTtlMs / (60 * 60 * 1000));
                this.logger.info(`TTL cleanup: removed ${removedKeys.length} inactive vector stores (${ttlHours}h TTL) to free ${Math.round(freedBytes / (1024 * 1024))}MB of memory`);
            }
            else {
                this.logger.info(`Memory cleanup: removed ${removedKeys.length} oldest vector stores to free ${Math.round(freedBytes / (1024 * 1024))}MB of memory`);
            }
        }
        getMemoryKeysList() {
            return Array.from(this.vectorStoreBuffer.keys());
        }
        async getVectorStore(memoryKey) {
            let vectorStoreInstance = this.vectorStoreBuffer.get(memoryKey);
            if (!vectorStoreInstance) {
                vectorStoreInstance = await memory_1.MemoryVectorStore.fromExistingIndex(this.embeddings);
                this.vectorStoreBuffer.set(memoryKey, vectorStoreInstance);
                this.storeMetadata.set(memoryKey, {
                    size: 0,
                    createdAt: new Date(),
                    lastAccessed: new Date(),
                });
            }
            else {
                const metadata = this.storeMetadata.get(memoryKey);
                if (metadata) {
                    metadata.lastAccessed = new Date();
                }
            }
            return vectorStoreInstance;
        }
        clearStoreMetadata(memoryKey) {
            const metadata = this.storeMetadata.get(memoryKey);
            if (metadata) {
                this.memoryUsageBytes -= metadata.size;
                metadata.size = 0;
                metadata.lastAccessed = new Date();
            }
        }
        getMemoryUsage() {
            return this.memoryUsageBytes;
        }
        getMemoryUsageFormatted() {
            return `${Math.round(this.memoryUsageBytes / (1024 * 1024))}MB`;
        }
        recalculateMemoryUsage() {
            this.memoryUsageBytes = 0;
            for (const [key, vectorStore] of this.vectorStoreBuffer.entries()) {
                const storeSize = this.memoryCalculator.calculateVectorStoreSize(vectorStore);
                const metadata = this.storeMetadata.get(key);
                if (metadata) {
                    metadata.size = storeSize;
                    this.memoryUsageBytes += storeSize;
                }
            }
            this.logger.debug(`Recalculated vector store memory: ${this.getMemoryUsageFormatted()}`);
        }
        async addDocuments(memoryKey, documents, clearStore) {
            if (clearStore) {
                this.clearStoreMetadata(memoryKey);
                this.vectorStoreBuffer.delete(memoryKey);
            }
            const estimatedAddedSize = this.memoryCalculator.estimateBatchSize(documents);
            this.cleanupService.cleanupOldestStores(estimatedAddedSize);
            const vectorStoreInstance = await this.getVectorStore(memoryKey);
            const vectorCountBefore = vectorStoreInstance.memoryVectors?.length || 0;
            await vectorStoreInstance.addDocuments(documents);
            const metadata = this.storeMetadata.get(memoryKey);
            if (metadata) {
                metadata.size += estimatedAddedSize;
                metadata.lastAccessed = new Date();
                this.memoryUsageBytes += estimatedAddedSize;
            }
            const vectorCount = vectorStoreInstance.memoryVectors?.length || 0;
            if ((vectorCount > 0 && vectorCount % 100 === 0) ||
                documents.length > 20 ||
                (vectorCountBefore === 0 && vectorCount > 0)) {
                this.recalculateMemoryUsage();
            }
            const maxMemoryMB = this.maxMemorySizeBytes > 0
                ? (this.maxMemorySizeBytes / (1024 * 1024)).toFixed(0)
                : 'unlimited';
            this.logger.debug(`Vector store memory: ${this.getMemoryUsageFormatted()}/${maxMemoryMB}MB (${vectorCount} vectors in ${this.vectorStoreBuffer.size} stores)`);
        }
        getStats() {
            const now = Date.now();
            let inactiveStoreCount = 0;
            this.recalculateMemoryUsage();
            const stats = {
                totalSizeBytes: this.memoryUsageBytes,
                totalSizeMB: Math.round((this.memoryUsageBytes / (1024 * 1024)) * 100) / 100,
                percentOfLimit: this.maxMemorySizeBytes > 0
                    ? Math.round((this.memoryUsageBytes / this.maxMemorySizeBytes) * 100)
                    : 0,
                maxMemoryMB: this.maxMemorySizeBytes > 0 ? this.maxMemorySizeBytes / (1024 * 1024) : -1,
                storeCount: this.vectorStoreBuffer.size,
                inactiveStoreCount: 0,
                ttlHours: this.inactiveTtlMs > 0 ? this.inactiveTtlMs / (60 * 60 * 1000) : -1,
                stores: {},
            };
            for (const [key, metadata] of this.storeMetadata.entries()) {
                const store = this.vectorStoreBuffer.get(key);
                if (store) {
                    const lastAccessedTime = metadata.lastAccessed.getTime();
                    const inactiveTimeMs = now - lastAccessedTime;
                    const isInactive = this.cleanupService.isStoreInactive(metadata);
                    if (isInactive) {
                        inactiveStoreCount++;
                    }
                    stats.stores[key] = {
                        sizeBytes: metadata.size,
                        sizeMB: Math.round((metadata.size / (1024 * 1024)) * 100) / 100,
                        percentOfTotal: Math.round((metadata.size / this.memoryUsageBytes) * 100) || 0,
                        vectors: store.memoryVectors?.length || 0,
                        createdAt: metadata.createdAt.toISOString(),
                        lastAccessed: metadata.lastAccessed.toISOString(),
                        inactive: isInactive,
                        inactiveForHours: Math.round(inactiveTimeMs / (60 * 60 * 1000)),
                    };
                }
            }
            stats.inactiveStoreCount = inactiveStoreCount;
            return stats;
        }
    }
    exports.MemoryVectorStoreManager = MemoryVectorStoreManager;
    MemoryVectorStoreManager.instance = null;
});
//# sourceMappingURL=MemoryVectorStoreManager.js.map