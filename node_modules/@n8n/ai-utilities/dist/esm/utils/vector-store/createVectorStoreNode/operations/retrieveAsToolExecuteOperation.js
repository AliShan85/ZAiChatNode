"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRetrieveAsToolExecuteOperation = handleRetrieveAsToolExecuteOperation;
const n8n_workflow_1 = require("n8n-workflow");
const helpers_1 = require("../../../helpers");
const log_ai_event_1 = require("../../../log-ai-event");
async function handleRetrieveAsToolExecuteOperation(context, args, embeddings, itemIndex) {
    const filter = (0, helpers_1.getMetadataFiltersValues)(context, itemIndex);
    const vectorStore = await args.getVectorStoreClient(context, undefined, embeddings, itemIndex);
    try {
        const inputData = context.getInputData();
        const item = inputData[itemIndex];
        const query = typeof item.json.input === 'string' ? item.json.input : undefined;
        if (!query || typeof query !== 'string') {
            throw new Error('Input data must contain a "input" field with the search query');
        }
        const topK = context.getNodeParameter('topK', itemIndex, 4);
        (0, n8n_workflow_1.assertParamIsNumber)('topK', topK, context.getNode());
        const useReranker = context.getNodeParameter('useReranker', itemIndex, false);
        (0, n8n_workflow_1.assertParamIsBoolean)('useReranker', useReranker, context.getNode());
        const includeDocumentMetadata = context.getNodeParameter('includeDocumentMetadata', itemIndex, true);
        (0, n8n_workflow_1.assertParamIsBoolean)('includeDocumentMetadata', includeDocumentMetadata, context.getNode());
        const embeddedQuery = await embeddings.embedQuery(query);
        let docs = await vectorStore.similaritySearchVectorWithScore(embeddedQuery, topK, filter);
        if (useReranker && docs.length > 0) {
            const reranker = (await context.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiReranker, 0));
            const documents = docs.map(([doc]) => doc);
            const rerankedDocuments = await reranker.compressDocuments(documents, query);
            docs = rerankedDocuments.map((doc) => {
                const { relevanceScore, ...metadata } = doc.metadata || {};
                return [{ ...doc, metadata }, relevanceScore ?? 0];
            });
        }
        const serializedDocs = docs.map(([doc]) => {
            if (includeDocumentMetadata) {
                return {
                    type: 'text',
                    text: JSON.stringify({ ...doc }),
                };
            }
            else {
                return {
                    type: 'text',
                    pageContent: JSON.stringify({ pageContent: doc.pageContent }),
                };
            }
        });
        (0, log_ai_event_1.logAiEvent)(context, 'ai-vector-store-searched', { input: query });
        return [
            {
                json: {
                    response: serializedDocs,
                },
                pairedItem: {
                    item: itemIndex,
                },
            },
        ];
    }
    finally {
        args.releaseVectorStoreClient?.(vectorStore);
    }
}
//# sourceMappingURL=retrieveAsToolExecuteOperation.js.map