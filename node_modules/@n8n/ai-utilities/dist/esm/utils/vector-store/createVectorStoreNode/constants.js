"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATION_MODE_DESCRIPTIONS = exports.DEFAULT_OPERATION_MODES = void 0;
const n8n_workflow_1 = require("n8n-workflow");
exports.DEFAULT_OPERATION_MODES = [
    'load',
    'insert',
    'retrieve',
    'retrieve-as-tool',
];
exports.OPERATION_MODE_DESCRIPTIONS = [
    {
        name: 'Get Many',
        value: 'load',
        description: 'Get many ranked documents from vector store for query',
        action: 'Get ranked documents from vector store',
    },
    {
        name: 'Insert Documents',
        value: 'insert',
        description: 'Insert documents into vector store',
        action: 'Add documents to vector store',
    },
    {
        name: 'Retrieve Documents (As Vector Store for Chain/Tool)',
        value: 'retrieve',
        description: 'Retrieve documents from vector store to be used as vector store with AI nodes',
        action: 'Retrieve documents for Chain/Tool as Vector Store',
        outputConnectionType: n8n_workflow_1.NodeConnectionTypes.AiVectorStore,
    },
    {
        name: 'Retrieve Documents (As Tool for AI Agent)',
        value: 'retrieve-as-tool',
        description: 'Retrieve documents from vector store to be used as tool with AI nodes',
        action: 'Retrieve documents for AI Agent as Tool',
        outputConnectionType: n8n_workflow_1.NodeConnectionTypes.AiTool,
    },
    {
        name: 'Update Documents',
        value: 'update',
        description: 'Update documents in vector store by ID',
        action: 'Update vector store documents',
    },
];
//# sourceMappingURL=constants.js.map