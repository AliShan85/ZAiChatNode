"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLoadOperation = handleLoadOperation;
const n8n_workflow_1 = require("n8n-workflow");
const helpers_1 = require("../../../helpers");
const log_ai_event_1 = require("../../../log-ai-event");
async function handleLoadOperation(context, args, embeddings, itemIndex) {
    const filter = (0, helpers_1.getMetadataFiltersValues)(context, itemIndex);
    const vectorStore = await args.getVectorStoreClient(context, undefined, embeddings, itemIndex);
    try {
        const prompt = context.getNodeParameter('prompt', itemIndex);
        const topK = context.getNodeParameter('topK', itemIndex, 4);
        const useReranker = context.getNodeParameter('useReranker', itemIndex, false);
        const includeDocumentMetadata = context.getNodeParameter('includeDocumentMetadata', itemIndex, true);
        const embeddedPrompt = await embeddings.embedQuery(prompt);
        let docs = await vectorStore.similaritySearchVectorWithScore(embeddedPrompt, topK, filter);
        if (useReranker && docs.length > 0) {
            const reranker = (await context.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiReranker, 0));
            const documents = docs.map(([doc]) => doc);
            const rerankedDocuments = await reranker.compressDocuments(documents, prompt);
            docs = rerankedDocuments.map((doc) => {
                const { relevanceScore, ...metadata } = doc.metadata || {};
                return [{ ...doc, metadata }, relevanceScore];
            });
        }
        const serializedDocs = docs.map(([doc, score]) => {
            const document = {
                pageContent: doc.pageContent,
                ...(includeDocumentMetadata ? { metadata: doc.metadata } : {}),
            };
            return {
                json: { document, score },
                pairedItem: {
                    item: itemIndex,
                },
            };
        });
        (0, log_ai_event_1.logAiEvent)(context, 'ai-vector-store-searched', { query: prompt });
        return serializedDocs;
    }
    finally {
        args.releaseVectorStoreClient?.(vectorStore);
    }
}
//# sourceMappingURL=loadOperation.js.map