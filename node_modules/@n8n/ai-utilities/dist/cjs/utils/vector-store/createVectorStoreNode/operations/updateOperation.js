(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "n8n-workflow", "../../../log-ai-event", "../../../n8n-json-loader", "../../processDocuments", "../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handleUpdateOperation = handleUpdateOperation;
    const n8n_workflow_1 = require("n8n-workflow");
    const log_ai_event_1 = require("../../../log-ai-event");
    const n8n_json_loader_1 = require("../../../n8n-json-loader");
    const processDocuments_1 = require("../../processDocuments");
    const utils_1 = require("../utils");
    async function handleUpdateOperation(context, args, embeddings) {
        if (!(0, utils_1.isUpdateSupported)(args)) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Update operation is not implemented for this Vector Store');
        }
        const items = context.getInputData();
        const loader = new n8n_json_loader_1.N8nJsonLoader(context);
        const resultData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const itemData = items[itemIndex];
            const documentId = context.getNodeParameter('id', itemIndex, '', {
                extractValue: true,
            });
            const vectorStore = await args.getVectorStoreClient(context, undefined, embeddings, itemIndex);
            try {
                const { processedDocuments, serializedDocuments } = await (0, processDocuments_1.processDocument)(loader, itemData, itemIndex);
                if (processedDocuments?.length !== 1) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Single document per item expected');
                }
                resultData.push(...serializedDocuments);
                await vectorStore.addDocuments(processedDocuments, {
                    ids: [documentId],
                });
                (0, log_ai_event_1.logAiEvent)(context, 'ai-vector-store-updated');
            }
            finally {
                args.releaseVectorStoreClient?.(vectorStore);
            }
        }
        return resultData;
    }
});
//# sourceMappingURL=updateOperation.js.map