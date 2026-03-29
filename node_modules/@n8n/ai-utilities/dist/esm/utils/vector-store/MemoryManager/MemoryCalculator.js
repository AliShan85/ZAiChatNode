"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCalculator = void 0;
const FLOAT_SIZE_BYTES = 8;
const CHAR_SIZE_BYTES = 2;
const VECTOR_OVERHEAD_BYTES = 200;
const EMBEDDING_DIMENSIONS = 1536;
const EMBEDDING_SIZE_BYTES = EMBEDDING_DIMENSIONS * FLOAT_SIZE_BYTES;
const AVG_METADATA_SIZE_BYTES = 100;
class MemoryCalculator {
    estimateBatchSize(documents) {
        if (documents.length === 0)
            return 0;
        let totalContentSize = 0;
        let totalMetadataSize = 0;
        for (const doc of documents) {
            if (doc.pageContent) {
                totalContentSize += doc.pageContent.length * CHAR_SIZE_BYTES;
            }
            if (doc.metadata) {
                const metadataKeys = Object.keys(doc.metadata).length;
                if (metadataKeys > 0) {
                    totalMetadataSize += metadataKeys * AVG_METADATA_SIZE_BYTES;
                }
            }
        }
        const embeddingSize = documents.length * EMBEDDING_SIZE_BYTES;
        const overhead = documents.length * VECTOR_OVERHEAD_BYTES;
        const calculatedSize = totalContentSize + totalMetadataSize + embeddingSize + overhead;
        return Math.ceil(calculatedSize);
    }
    calculateVectorStoreSize(vectorStore) {
        if (!vectorStore.memoryVectors || vectorStore.memoryVectors.length === 0) {
            return 0;
        }
        let storeSize = 0;
        for (const vector of vectorStore.memoryVectors) {
            storeSize += vector.embedding.length * FLOAT_SIZE_BYTES;
            storeSize += vector.content ? vector.content.length * CHAR_SIZE_BYTES : 0;
            if (vector.metadata) {
                const metadataStr = JSON.stringify(vector.metadata);
                storeSize += metadataStr.length * CHAR_SIZE_BYTES;
            }
            storeSize += VECTOR_OVERHEAD_BYTES;
        }
        return Math.ceil(storeSize);
    }
}
exports.MemoryCalculator = MemoryCalculator;
//# sourceMappingURL=MemoryCalculator.js.map