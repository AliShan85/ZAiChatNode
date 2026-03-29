(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "n8n-workflow", "../../../fromai-tool-factory", "../../../helpers", "../../../log-wrapper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handleRetrieveAsToolOperation = handleRetrieveAsToolOperation;
    const n8n_workflow_1 = require("n8n-workflow");
    const fromai_tool_factory_1 = require("../../../fromai-tool-factory");
    const helpers_1 = require("../../../helpers");
    const log_wrapper_1 = require("../../../log-wrapper");
    async function handleRetrieveAsToolOperation(context, args, embeddings, itemIndex) {
        const toolDescription = context.getNodeParameter('toolDescription', itemIndex);
        const node = context.getNode();
        const { typeVersion } = node;
        const toolName = typeVersion < 1.3
            ? context.getNodeParameter('toolName', itemIndex)
            : (0, n8n_workflow_1.nodeNameToToolName)(node);
        const vectorStoreTool = (0, fromai_tool_factory_1.createToolFromNode)(node, {
            name: toolName,
            description: toolDescription,
            extraArgs: [{ key: 'input', description: 'Query to search for. Required' }],
            func: async (query) => {
                const topK = context.getNodeParameter('topK', itemIndex, 4);
                const useReranker = context.getNodeParameter('useReranker', itemIndex, false);
                const includeDocumentMetadata = context.getNodeParameter('includeDocumentMetadata', itemIndex, true);
                const filter = (0, helpers_1.getMetadataFiltersValues)(context, itemIndex);
                const queryString = typeof query === 'string' ? query : query.input;
                (0, n8n_workflow_1.assert)(typeof queryString === 'string', 'Query must be of type string');
                const vectorStore = await args.getVectorStoreClient(context, undefined, embeddings, itemIndex);
                try {
                    const embeddedPrompt = await embeddings.embedQuery(queryString);
                    let documents = await vectorStore.similaritySearchVectorWithScore(embeddedPrompt, topK, filter);
                    if (useReranker && documents.length > 0) {
                        const reranker = (await context.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiReranker, 0));
                        const docs = documents.map(([doc]) => doc);
                        const rerankedDocuments = await reranker.compressDocuments(docs, queryString);
                        documents = rerankedDocuments.map((doc) => {
                            const { relevanceScore, ...metadata } = doc.metadata;
                            return [{ ...doc, metadata }, relevanceScore];
                        });
                    }
                    return documents
                        .map((document) => {
                        if (includeDocumentMetadata) {
                            return { type: 'text', text: JSON.stringify(document[0]) };
                        }
                        return {
                            type: 'text',
                            text: JSON.stringify({ pageContent: document[0].pageContent }),
                        };
                    })
                        .filter((document) => !!document);
                }
                finally {
                    args.releaseVectorStoreClient?.(vectorStore);
                }
            },
        });
        return {
            response: (0, log_wrapper_1.logWrapper)(vectorStoreTool, context),
        };
    }
});
//# sourceMappingURL=retrieveAsToolOperation.js.map