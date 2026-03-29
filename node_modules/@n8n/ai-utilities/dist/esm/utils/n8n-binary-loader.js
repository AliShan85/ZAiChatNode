"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nBinaryLoader = void 0;
const json_1 = require("@langchain/classic/document_loaders/fs/json");
const text_1 = require("@langchain/classic/document_loaders/fs/text");
const csv_1 = require("@langchain/community/document_loaders/fs/csv");
const docx_1 = require("@langchain/community/document_loaders/fs/docx");
const epub_1 = require("@langchain/community/document_loaders/fs/epub");
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const fs_1 = require("fs");
const n8n_workflow_1 = require("n8n-workflow");
const promises_1 = require("stream/promises");
const tmp_promise_1 = require("tmp-promise");
const helpers_1 = require("./helpers");
const SUPPORTED_MIME_TYPES = {
    auto: ['*/*'],
    pdfLoader: ['application/pdf'],
    csvLoader: ['text/csv'],
    epubLoader: ['application/epub+zip'],
    docxLoader: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    textLoader: ['text/plain', 'text/mdx', 'text/md', 'text/markdown'],
    jsonLoader: ['application/json'],
};
class N8nBinaryLoader {
    constructor(context, optionsPrefix = '', binaryDataKey = '', textSplitter) {
        this.context = context;
        this.optionsPrefix = optionsPrefix;
        this.binaryDataKey = binaryDataKey;
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
    async validateMimeType(mimeType, selectedLoader) {
        if (selectedLoader !== 'auto' && !SUPPORTED_MIME_TYPES[selectedLoader].includes(mimeType)) {
            const neededLoader = Object.keys(SUPPORTED_MIME_TYPES).find((loader) => SUPPORTED_MIME_TYPES[loader].includes(mimeType));
            throw new n8n_workflow_1.NodeOperationError(this.context.getNode(), `Mime type doesn't match selected loader. Please select under "Loader Type": ${neededLoader}`);
        }
        if (!Object.values(SUPPORTED_MIME_TYPES).flat().includes(mimeType)) {
            throw new n8n_workflow_1.NodeOperationError(this.context.getNode(), `Unsupported mime type: ${mimeType}`);
        }
        if (!SUPPORTED_MIME_TYPES[selectedLoader].includes(mimeType) &&
            selectedLoader !== 'textLoader' &&
            selectedLoader !== 'auto') {
            throw new n8n_workflow_1.NodeOperationError(this.context.getNode(), `Unsupported mime type: ${mimeType} for selected loader: ${selectedLoader}`);
        }
    }
    async getFilePathOrBlob(binaryData, mimeType) {
        if (binaryData.id) {
            const binaryBuffer = await this.context.helpers.binaryToBuffer(await this.context.helpers.getBinaryStream(binaryData.id));
            return new Blob([binaryBuffer], {
                type: mimeType,
            });
        }
        else {
            return new Blob([Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING)], {
                type: mimeType,
            });
        }
    }
    async getLoader(mimeType, filePathOrBlob, itemIndex) {
        switch (mimeType) {
            case 'application/pdf':
                const splitPages = this.context.getNodeParameter(`${this.optionsPrefix}splitPages`, itemIndex, false);
                return new pdf_1.PDFLoader(filePathOrBlob, { splitPages });
            case 'text/csv':
                const column = this.context.getNodeParameter(`${this.optionsPrefix}column`, itemIndex, null);
                const separator = this.context.getNodeParameter(`${this.optionsPrefix}separator`, itemIndex, ',');
                return new csv_1.CSVLoader(filePathOrBlob, { column: column ?? undefined, separator });
            case 'application/epub+zip':
                let filePath;
                if (filePathOrBlob instanceof Blob) {
                    const tmpFileData = await (0, tmp_promise_1.file)({ prefix: 'epub-loader-' });
                    const bufferData = await filePathOrBlob.arrayBuffer();
                    await (0, promises_1.pipeline)([new Uint8Array(bufferData)], (0, fs_1.createWriteStream)(tmpFileData.path));
                    return new epub_1.EPubLoader(tmpFileData.path);
                }
                else {
                    filePath = filePathOrBlob;
                }
                return new epub_1.EPubLoader(filePath);
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return new docx_1.DocxLoader(filePathOrBlob);
            case 'text/plain':
                return new text_1.TextLoader(filePathOrBlob);
            case 'application/json':
                const pointers = this.context.getNodeParameter(`${this.optionsPrefix}pointers`, itemIndex, '');
                const pointersArray = pointers.split(',').map((pointer) => pointer.trim());
                return new json_1.JSONLoader(filePathOrBlob, pointersArray);
            default:
                return new text_1.TextLoader(filePathOrBlob);
        }
    }
    async loadDocuments(loader) {
        return this.textSplitter
            ? await this.textSplitter.splitDocuments(await loader.load())
            : await loader.load();
    }
    async cleanupTmpFileIfNeeded(cleanupTmpFile) {
        if (cleanupTmpFile) {
            await cleanupTmpFile();
        }
    }
    async processItem(item, itemIndex) {
        const docs = [];
        const binaryMode = this.context.getNodeParameter('binaryMode', itemIndex, 'allInputData');
        if (binaryMode === 'allInputData') {
            const binaryData = this.context.getInputData();
            for (const data of binaryData) {
                if (data.binary) {
                    const binaryDataKeys = Object.keys(data.binary);
                    for (const fileKey of binaryDataKeys) {
                        const processedDocuments = await this.processItemByKey(item, itemIndex, fileKey);
                        docs.push(...processedDocuments);
                    }
                }
            }
        }
        else {
            const processedDocuments = await this.processItemByKey(item, itemIndex, this.binaryDataKey);
            docs.push(...processedDocuments);
        }
        return docs;
    }
    async processItemByKey(item, itemIndex, binaryKey) {
        const selectedLoader = this.context.getNodeParameter('loader', itemIndex, 'auto');
        const docs = [];
        const metadata = (0, helpers_1.getMetadataFiltersValues)(this.context, itemIndex);
        if (!item)
            return [];
        const binaryData = this.context.helpers.assertBinaryData(itemIndex, binaryKey);
        const { mimeType } = binaryData;
        await this.validateMimeType(mimeType, selectedLoader);
        const filePathOrBlob = await this.getFilePathOrBlob(binaryData, mimeType);
        const cleanupTmpFile = undefined;
        const loader = await this.getLoader(mimeType, filePathOrBlob, itemIndex);
        const loadedDoc = await this.loadDocuments(loader);
        docs.push(...loadedDoc);
        if (metadata) {
            docs.forEach((document) => {
                document.metadata = {
                    ...document.metadata,
                    ...metadata,
                };
            });
        }
        await this.cleanupTmpFileIfNeeded(cleanupTmpFile);
        return docs;
    }
}
exports.N8nBinaryLoader = N8nBinaryLoader;
//# sourceMappingURL=n8n-binary-loader.js.map