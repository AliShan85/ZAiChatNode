"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nJsonLoader = void 0;
const json_1 = require("@langchain/classic/document_loaders/fs/json");
const text_1 = require("@langchain/classic/document_loaders/fs/text");
const n8n_workflow_1 = require("n8n-workflow");
const helpers_1 = require("./helpers");
class N8nJsonLoader {
    constructor(context, optionsPrefix = '', textSplitter) {
        this.context = context;
        this.optionsPrefix = optionsPrefix;
        this.textSplitter = textSplitter;
    }
    async processAll(items) {
        const docs = [];
        if (!items)
            return [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const processedDocuments = await this.processItem(items[itemIndex], itemIndex);
            docs.push(...processedDocuments);
        }
        return docs;
    }
    async processItem(item, itemIndex) {
        const mode = this.context.getNodeParameter('jsonMode', itemIndex, 'allInputData');
        const pointers = this.context.getNodeParameter(`${this.optionsPrefix}pointers`, itemIndex, '');
        const pointersArray = pointers.split(',').map((pointer) => pointer.trim());
        const metadata = (0, helpers_1.getMetadataFiltersValues)(this.context, itemIndex) ?? [];
        if (!item)
            return [];
        let documentLoader = null;
        if (mode === 'allInputData') {
            const itemString = JSON.stringify(item.json);
            const itemBlob = new Blob([itemString], { type: 'application/json' });
            documentLoader = new json_1.JSONLoader(itemBlob, pointersArray);
        }
        if (mode === 'expressionData') {
            const dataString = this.context.getNodeParameter('jsonData', itemIndex);
            if (typeof dataString === 'object') {
                const itemBlob = new Blob([JSON.stringify(dataString)], { type: 'application/json' });
                documentLoader = new json_1.JSONLoader(itemBlob, pointersArray);
            }
            if (typeof dataString === 'string') {
                const itemBlob = new Blob([dataString], { type: 'text/plain' });
                documentLoader = new text_1.TextLoader(itemBlob);
            }
        }
        if (documentLoader === null) {
            throw new n8n_workflow_1.NodeOperationError(this.context.getNode(), 'Document loader is not initialized');
        }
        const docs = this.textSplitter
            ? await this.textSplitter.splitDocuments(await documentLoader.load())
            : await documentLoader.load();
        if (metadata) {
            docs.forEach((doc) => {
                doc.metadata = {
                    ...doc.metadata,
                    ...metadata,
                };
            });
        }
        return docs;
    }
}
exports.N8nJsonLoader = N8nJsonLoader;
//# sourceMappingURL=n8n-json-loader.js.map