(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../n8n-binary-loader", "../n8n-json-loader"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.processDocuments = processDocuments;
    exports.processDocument = processDocument;
    const n8n_binary_loader_1 = require("../n8n-binary-loader");
    const n8n_json_loader_1 = require("../n8n-json-loader");
    async function processDocuments(documentInput, inputItems) {
        let processedDocuments;
        if (documentInput instanceof n8n_json_loader_1.N8nJsonLoader || documentInput instanceof n8n_binary_loader_1.N8nBinaryLoader) {
            processedDocuments = await documentInput.processAll(inputItems);
        }
        else {
            processedDocuments = documentInput;
        }
        const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
            json: { metadata, pageContent },
        }));
        return {
            processedDocuments,
            serializedDocuments,
        };
    }
    async function processDocument(documentInput, inputItem, itemIndex) {
        let processedDocuments;
        if (documentInput instanceof n8n_json_loader_1.N8nJsonLoader || documentInput instanceof n8n_binary_loader_1.N8nBinaryLoader) {
            processedDocuments = await documentInput.processItem(inputItem, itemIndex);
        }
        else {
            processedDocuments = documentInput;
        }
        const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
            json: { metadata, pageContent },
            pairedItem: {
                item: itemIndex,
            },
        }));
        return {
            processedDocuments,
            serializedDocuments,
        };
    }
});
//# sourceMappingURL=processDocuments.js.map