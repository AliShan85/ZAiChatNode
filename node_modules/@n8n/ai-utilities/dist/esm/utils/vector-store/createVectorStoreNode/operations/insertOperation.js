"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInsertOperation = handleInsertOperation;
const n8n_workflow_1 = require("n8n-workflow");
const log_ai_event_1 = require("../../../log-ai-event");
const processDocuments_1 = require("../../processDocuments");
async function handleInsertOperation(context, args, embeddings) {
    const nodeVersion = context.getNode().typeVersion;
    const items = context.getInputData();
    const documentInput = (await context.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiDocument, 0));
    const resultData = [];
    const documentsForEmbedding = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        if (context.getExecutionCancelSignal()?.aborted) {
            break;
        }
        const itemData = items[itemIndex];
        const processedDocuments = await (0, processDocuments_1.processDocument)(documentInput, itemData, itemIndex);
        resultData.push(...processedDocuments.serializedDocuments);
        documentsForEmbedding.push(...processedDocuments.processedDocuments);
        if (nodeVersion === 1) {
            await args.populateVectorStore(context, embeddings, processedDocuments.processedDocuments, itemIndex);
        }
        (0, log_ai_event_1.logAiEvent)(context, 'ai-vector-store-populated');
    }
    if (nodeVersion >= 1.1) {
        if (args.beforeInsert) {
            await args.beforeInsert(context, embeddings, 0);
        }
        const embeddingBatchSize = context.getNodeParameter('embeddingBatchSize', 0, 200) ?? 200;
        for (let i = 0; i < documentsForEmbedding.length; i += embeddingBatchSize) {
            const nextBatch = documentsForEmbedding.slice(i, i + embeddingBatchSize);
            await args.populateVectorStore(context, embeddings, nextBatch, 0);
        }
    }
    return resultData;
}
//# sourceMappingURL=insertOperation.js.map