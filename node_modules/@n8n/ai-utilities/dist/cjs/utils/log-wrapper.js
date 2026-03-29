(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/core/embeddings", "@langchain/core/retrievers", "@langchain/core/retrievers/document_compressors", "@langchain/core/vectorstores", "@langchain/textsplitters", "n8n-workflow", "../guards", "./embeddings-input-validation", "./log-ai-event", "./n8n-binary-loader", "./n8n-json-loader"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callMethodAsync = callMethodAsync;
    exports.callMethodSync = callMethodSync;
    exports.logWrapper = logWrapper;
    const embeddings_1 = require("@langchain/core/embeddings");
    const retrievers_1 = require("@langchain/core/retrievers");
    const document_compressors_1 = require("@langchain/core/retrievers/document_compressors");
    const vectorstores_1 = require("@langchain/core/vectorstores");
    const textsplitters_1 = require("@langchain/textsplitters");
    const n8n_workflow_1 = require("n8n-workflow");
    const guards_1 = require("../guards");
    const embeddings_input_validation_1 = require("./embeddings-input-validation");
    const log_ai_event_1 = require("./log-ai-event");
    const n8n_binary_loader_1 = require("./n8n-binary-loader");
    const n8n_json_loader_1 = require("./n8n-json-loader");
    async function callMethodAsync(parameters) {
        try {
            return await parameters.method.call(this, ...parameters.arguments);
        }
        catch (e) {
            const connectedNode = parameters.executeFunctions.getNode();
            const error = new n8n_workflow_1.NodeOperationError(connectedNode, e, {
                functionality: 'configuration-node',
            });
            const metadata = (0, n8n_workflow_1.parseErrorMetadata)(error);
            parameters.executeFunctions.addOutputData(parameters.connectionType, parameters.currentNodeRunIndex, error, metadata);
            if (error.message) {
                if (!error.description) {
                    error.description = error.message;
                }
                throw error;
            }
            throw new n8n_workflow_1.NodeOperationError(connectedNode, `Error on node "${connectedNode.name}" which is connected via input "${parameters.connectionType}"`, { functionality: 'configuration-node' });
        }
    }
    function callMethodSync(parameters) {
        try {
            return parameters.method.call(this, ...parameters.arguments);
        }
        catch (e) {
            const connectedNode = parameters.executeFunctions.getNode();
            const error = new n8n_workflow_1.NodeOperationError(connectedNode, e);
            parameters.executeFunctions.addOutputData(parameters.connectionType, parameters.currentNodeRunIndex, error);
            throw new n8n_workflow_1.NodeOperationError(connectedNode, `Error on node "${connectedNode.name}" which is connected via input "${parameters.connectionType}"`, { functionality: 'configuration-node' });
        }
    }
    function logWrapper(originalInstance, executeFunctions) {
        return new Proxy(originalInstance, {
            get: (target, prop) => {
                let connectionType;
                if ((0, guards_1.isBaseChatMemory)(originalInstance)) {
                    if (prop === 'loadMemoryVariables' && 'loadMemoryVariables' in target) {
                        return async (values) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiMemory;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { action: 'loadMemoryVariables', values } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [values],
                            }));
                            const chatHistory = response?.chat_history ?? response;
                            executeFunctions.addOutputData(connectionType, index, [
                                [{ json: { action: 'loadMemoryVariables', chatHistory } }],
                            ]);
                            return response;
                        };
                    }
                    else if (prop === 'saveContext' && 'saveContext' in target) {
                        return async (input, output) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiMemory;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { action: 'saveContext', input, output } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [input, output],
                            }));
                            const chatHistory = await target.chatHistory.getMessages();
                            executeFunctions.addOutputData(connectionType, index, [
                                [{ json: { action: 'saveContext', chatHistory } }],
                            ]);
                            return response;
                        };
                    }
                }
                if ((0, guards_1.isBaseChatMessageHistory)(originalInstance)) {
                    if (prop === 'getMessages' && 'getMessages' in target) {
                        return async () => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiMemory;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { action: 'getMessages' } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [],
                            }));
                            const payload = { action: 'getMessages', response };
                            executeFunctions.addOutputData(connectionType, index, [[{ json: payload }]]);
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-messages-retrieved-from-memory', { response });
                            return response;
                        };
                    }
                    else if (prop === 'addMessage' && 'addMessage' in target) {
                        return async (message) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiMemory;
                            const payload = { action: 'addMessage', message };
                            const { index } = executeFunctions.addInputData(connectionType, [[{ json: payload }]]);
                            await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [message],
                            });
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-message-added-to-memory', { message });
                            executeFunctions.addOutputData(connectionType, index, [[{ json: payload }]]);
                        };
                    }
                }
                if (originalInstance instanceof retrievers_1.BaseRetriever) {
                    if (prop === 'getRelevantDocuments' && 'getRelevantDocuments' in target) {
                        return async (query, config) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiRetriever;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { query, config } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [query, config],
                            }));
                            const executionId = response[0]?.metadata?.executionId;
                            const workflowId = response[0]?.metadata?.workflowId;
                            const metadata = {};
                            if (executionId && workflowId) {
                                metadata.subExecution = {
                                    executionId,
                                    workflowId,
                                };
                            }
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-documents-retrieved', { query });
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]], metadata);
                            return response;
                        };
                    }
                }
                if (originalInstance instanceof embeddings_1.Embeddings) {
                    if (prop === 'embedDocuments' && 'embedDocuments' in target) {
                        return async (documents) => {
                            const validatedDocuments = (0, embeddings_input_validation_1.validateEmbedDocumentsInput)(documents, executeFunctions.getNode());
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiEmbedding;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { documents: validatedDocuments } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [validatedDocuments],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-document-embedded');
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            return response;
                        };
                    }
                    if (prop === 'embedQuery' && 'embedQuery' in target) {
                        return async (query) => {
                            const validatedQuery = (0, embeddings_input_validation_1.validateEmbedQueryInput)(query, executeFunctions.getNode());
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiEmbedding;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { query: validatedQuery } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [validatedQuery],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-query-embedded');
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            return response;
                        };
                    }
                }
                if (originalInstance instanceof document_compressors_1.BaseDocumentCompressor) {
                    if (prop === 'compressDocuments' && 'compressDocuments' in target) {
                        return async (documents, query) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiReranker;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { query, documents } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [(0, n8n_workflow_1.deepCopy)(documents), query],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-document-reranked', { query });
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            return response;
                        };
                    }
                }
                if (originalInstance instanceof n8n_json_loader_1.N8nJsonLoader ||
                    originalInstance instanceof n8n_binary_loader_1.N8nBinaryLoader) {
                    if (prop === 'processAll' && 'processAll' in target) {
                        return async (items) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiDocument;
                            const { index } = executeFunctions.addInputData(connectionType, [items]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [items],
                            }));
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            return response;
                        };
                    }
                    if (prop === 'processItem' && 'processItem' in target) {
                        return async (item, itemIndex) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiDocument;
                            const { index } = executeFunctions.addInputData(connectionType, [[item]]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [item, itemIndex],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-document-processed');
                            executeFunctions.addOutputData(connectionType, index, [
                                [{ json: { response }, pairedItem: { item: itemIndex } }],
                            ]);
                            return response;
                        };
                    }
                }
                if (originalInstance instanceof textsplitters_1.TextSplitter) {
                    if (prop === 'splitText' && 'splitText' in target) {
                        return async (text) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiTextSplitter;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { textSplitter: text } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [text],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-text-split');
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            return response;
                        };
                    }
                }
                if ((0, guards_1.isToolsInstance)(originalInstance)) {
                    if (prop === '_call' && '_call' in target) {
                        return async (query) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiTool;
                            const inputData = { query };
                            if (target.metadata?.isFromToolkit) {
                                inputData.tool = {
                                    name: target.name,
                                    description: target.description,
                                };
                            }
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: inputData }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [query],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-tool-called', { ...inputData, response });
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            if (typeof response === 'string')
                                return response;
                            return JSON.stringify(response);
                        };
                    }
                }
                if (originalInstance instanceof vectorstores_1.VectorStore) {
                    if (prop === 'similaritySearch' && 'similaritySearch' in target) {
                        return async (query, k, filter, _callbacks) => {
                            connectionType = n8n_workflow_1.NodeConnectionTypes.AiVectorStore;
                            const { index } = executeFunctions.addInputData(connectionType, [
                                [{ json: { query, k, filter } }],
                            ]);
                            const response = (await callMethodAsync.call(target, {
                                executeFunctions,
                                connectionType,
                                currentNodeRunIndex: index,
                                method: target[prop],
                                arguments: [query, k, filter, _callbacks],
                            }));
                            (0, log_ai_event_1.logAiEvent)(executeFunctions, 'ai-vector-store-searched', { query });
                            executeFunctions.addOutputData(connectionType, index, [[{ json: { response } }]]);
                            return response;
                        };
                    }
                }
                return target[prop];
            },
        });
    }
});
//# sourceMappingURL=log-wrapper.js.map