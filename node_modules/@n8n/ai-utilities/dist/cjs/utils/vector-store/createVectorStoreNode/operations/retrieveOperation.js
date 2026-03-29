(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "n8n-workflow", "../../../helpers", "../../../log-wrapper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handleRetrieveOperation = handleRetrieveOperation;
    const n8n_workflow_1 = require("n8n-workflow");
    const helpers_1 = require("../../../helpers");
    const log_wrapper_1 = require("../../../log-wrapper");
    async function handleRetrieveOperation(context, args, embeddings, itemIndex) {
        const filter = (0, helpers_1.getMetadataFiltersValues)(context, itemIndex);
        const useReranker = context.getNodeParameter('useReranker', itemIndex, false);
        const vectorStore = await args.getVectorStoreClient(context, filter, embeddings, itemIndex);
        let response = vectorStore;
        if (useReranker) {
            const reranker = (await context.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiReranker, 0));
            response = {
                reranker,
                vectorStore: (0, log_wrapper_1.logWrapper)(vectorStore, context),
            };
        }
        else {
            response = (0, log_wrapper_1.logWrapper)(vectorStore, context);
        }
        return {
            response,
            closeFunction: async () => {
                args.releaseVectorStoreClient?.(vectorStore);
            },
        };
    }
});
//# sourceMappingURL=retrieveOperation.js.map