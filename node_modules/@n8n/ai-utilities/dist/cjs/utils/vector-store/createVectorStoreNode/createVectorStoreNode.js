(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "n8n-workflow", "./operations", "./utils", "../../shared-fields"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createVectorStoreNode = void 0;
    const n8n_workflow_1 = require("n8n-workflow");
    const operations_1 = require("./operations");
    const utils_1 = require("./utils");
    const shared_fields_1 = require("../../shared-fields");
    const ragStarterCallout = {
        displayName: 'Tip: Get a feel for vector stores in n8n with our',
        name: 'ragStarterCallout',
        type: 'callout',
        typeOptions: {
            calloutAction: {
                label: 'RAG starter template',
                type: 'openSampleWorkflowTemplate',
                templateId: 'rag-starter-template',
            },
        },
        default: '',
    };
    const createVectorStoreNode = (args) => class VectorStoreNodeType {
        constructor() {
            this.description = {
                displayName: args.meta.displayName,
                name: args.meta.name,
                description: args.meta.description,
                ...(args.hidden === true ? { hidden: true } : {}),
                icon: args.meta.icon,
                iconColor: args.meta.iconColor,
                group: ['transform'],
                version: [1, 1.1, 1.2, 1.3],
                defaults: {
                    name: args.meta.displayName,
                },
                codex: {
                    categories: args.meta.categories ?? ['AI'],
                    subcategories: args.meta.subcategories ?? {
                        AI: ['Vector Stores', 'Tools', 'Root Nodes'],
                        'Vector Stores': ['Other Vector Stores'],
                        Tools: ['Other Tools'],
                    },
                    resources: {
                        primaryDocumentation: [
                            {
                                url: args.meta.docsUrl,
                            },
                        ],
                    },
                },
                builderHint: {
                    ...args.meta.builderHint,
                    inputs: {
                        ai_embedding: { required: true },
                        ai_document: {
                            required: true,
                            displayOptions: { show: { mode: ['insert'] } },
                        },
                        ai_reranker: {
                            required: true,
                            displayOptions: {
                                show: { mode: ['load', 'retrieve', 'retrieve-as-tool'], useReranker: [true] },
                            },
                        },
                    },
                },
                credentials: args.meta.credentials,
                inputs: `={{
			((parameters) => {
				const mode = parameters?.mode;
				const useReranker = parameters?.useReranker;
				const inputs = [{ displayName: "Embedding", type: "${n8n_workflow_1.NodeConnectionTypes.AiEmbedding}", required: true, maxConnections: 1}]

				if (['load', 'retrieve', 'retrieve-as-tool'].includes(mode) && useReranker) {
					inputs.push({ displayName: "Reranker", type: "${n8n_workflow_1.NodeConnectionTypes.AiReranker}", required: true, maxConnections: 1})
				}

				if (mode === 'retrieve-as-tool') {
					return inputs;
				}

				if (['insert', 'load', 'update'].includes(mode)) {
					inputs.push({ displayName: "", type: "${n8n_workflow_1.NodeConnectionTypes.Main}"})
				}

				if (['insert'].includes(mode)) {
					inputs.push({ displayName: "Document", type: "${n8n_workflow_1.NodeConnectionTypes.AiDocument}", required: true, maxConnections: 1})
				}
				return inputs
			})($parameter)
		}}`,
                outputs: `={{
			((parameters) => {
				const mode = parameters?.mode ?? 'retrieve';

				if (mode === 'retrieve-as-tool') {
					return [{ displayName: "Tool", type: "${n8n_workflow_1.NodeConnectionTypes.AiTool}"}]
				}

				if (mode === 'retrieve') {
					return [{ displayName: "Vector Store", type: "${n8n_workflow_1.NodeConnectionTypes.AiVectorStore}"}]
				}
				return [{ displayName: "", type: "${n8n_workflow_1.NodeConnectionTypes.Main}"}]
			})($parameter)
		}}`,
                properties: [
                    ragStarterCallout,
                    {
                        displayName: 'Operation Mode',
                        name: 'mode',
                        type: 'options',
                        noDataExpression: true,
                        default: 'retrieve',
                        options: (0, utils_1.getOperationModeOptions)(args),
                    },
                    {
                        ...(0, shared_fields_1.getConnectionHintNoticeField)([n8n_workflow_1.NodeConnectionTypes.AiRetriever]),
                        displayOptions: {
                            show: {
                                mode: ['retrieve'],
                            },
                        },
                    },
                    {
                        displayName: 'Name',
                        name: 'toolName',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'Name of the vector store',
                        placeholder: 'e.g. company_knowledge_base',
                        validateType: 'string-alphanumeric',
                        displayOptions: {
                            show: {
                                '@version': [{ _cnd: { lte: 1.2 } }],
                                mode: ['retrieve-as-tool'],
                            },
                        },
                    },
                    {
                        displayName: 'Description',
                        name: 'toolDescription',
                        type: 'string',
                        default: '',
                        required: true,
                        typeOptions: { rows: 2 },
                        description: 'Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often',
                        placeholder: `e.g. ${args.meta.description}`,
                        displayOptions: {
                            show: {
                                mode: ['retrieve-as-tool'],
                            },
                        },
                    },
                    ...args.sharedFields,
                    {
                        displayName: 'Embedding Batch Size',
                        name: 'embeddingBatchSize',
                        type: 'number',
                        default: 200,
                        description: 'Number of documents to embed in a single batch',
                        displayOptions: {
                            show: {
                                mode: ['insert'],
                                '@version': [{ _cnd: { gte: 1.1 } }],
                            },
                        },
                    },
                    ...(0, utils_1.transformDescriptionForOperationMode)(args.insertFields ?? [], 'insert'),
                    {
                        displayName: 'Prompt',
                        name: 'prompt',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'Search prompt to retrieve matching documents from the vector store using similarity-based ranking',
                        displayOptions: {
                            show: {
                                mode: ['load'],
                            },
                        },
                    },
                    {
                        displayName: 'Limit',
                        name: 'topK',
                        type: 'number',
                        default: 4,
                        description: 'Number of top results to fetch from vector store',
                        displayOptions: {
                            show: {
                                mode: ['load', 'retrieve-as-tool'],
                            },
                        },
                    },
                    {
                        displayName: 'Include Metadata',
                        name: 'includeDocumentMetadata',
                        type: 'boolean',
                        default: true,
                        description: 'Whether or not to include document metadata',
                        displayOptions: {
                            show: {
                                mode: ['load', 'retrieve-as-tool'],
                            },
                        },
                    },
                    {
                        displayName: 'Rerank Results',
                        name: 'useReranker',
                        type: 'boolean',
                        default: false,
                        description: 'Whether or not to rerank results',
                        displayOptions: {
                            show: {
                                mode: ['load', 'retrieve', 'retrieve-as-tool'],
                            },
                        },
                    },
                    {
                        displayName: 'ID',
                        name: 'id',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'ID of an embedding entry',
                        displayOptions: {
                            show: {
                                mode: ['update'],
                            },
                        },
                    },
                    ...(0, utils_1.transformDescriptionForOperationMode)(args.loadFields ?? [], [
                        'load',
                        'retrieve-as-tool',
                    ]),
                    ...(0, utils_1.transformDescriptionForOperationMode)(args.retrieveFields ?? [], 'retrieve'),
                    ...(0, utils_1.transformDescriptionForOperationMode)(args.updateFields ?? [], 'update'),
                ],
            };
            this.methods = args.methods;
        }
        async execute() {
            const mode = this.getNodeParameter('mode', 0);
            const embeddings = (await this.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiEmbedding, 0));
            if (mode === 'load') {
                const items = this.getInputData(0);
                const resultData = [];
                for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    const docs = await (0, operations_1.handleLoadOperation)(this, args, embeddings, itemIndex);
                    resultData.push(...docs);
                }
                return [resultData];
            }
            if (mode === 'insert') {
                const resultData = await (0, operations_1.handleInsertOperation)(this, args, embeddings);
                return [resultData];
            }
            if (mode === 'update') {
                const resultData = await (0, operations_1.handleUpdateOperation)(this, args, embeddings);
                return [resultData];
            }
            if (mode === 'retrieve-as-tool') {
                const items = this.getInputData(0);
                const resultData = [];
                for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                    const docs = await (0, operations_1.handleRetrieveAsToolExecuteOperation)(this, args, embeddings, itemIndex);
                    resultData.push(...docs);
                }
                return [resultData];
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Only the "load", "update", "insert", and "retrieve-as-tool" operation modes are supported with execute');
        }
        async supplyData(itemIndex) {
            const mode = this.getNodeParameter('mode', 0);
            const embeddings = (await this.getInputConnectionData(n8n_workflow_1.NodeConnectionTypes.AiEmbedding, 0));
            if (mode === 'retrieve') {
                return await (0, operations_1.handleRetrieveOperation)(this, args, embeddings, itemIndex);
            }
            if (mode === 'retrieve-as-tool') {
                return await (0, operations_1.handleRetrieveAsToolOperation)(this, args, embeddings, itemIndex);
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Only the "retrieve" and "retrieve-as-tool" operation mode is supported to supply data');
        }
    };
    exports.createVectorStoreNode = createVectorStoreNode;
});
//# sourceMappingURL=createVectorStoreNode.js.map