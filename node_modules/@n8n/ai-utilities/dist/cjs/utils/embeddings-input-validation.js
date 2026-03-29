(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "n8n-workflow"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateEmbedQueryInput = validateEmbedQueryInput;
    exports.validateEmbedDocumentsInput = validateEmbedDocumentsInput;
    const n8n_workflow_1 = require("n8n-workflow");
    function validateEmbedQueryInput(query, node) {
        if (typeof query !== 'string' || query === '') {
            throw new n8n_workflow_1.NodeOperationError(node, 'Cannot embed empty or undefined text', {
                description: 'The text provided for embedding is empty or undefined. This can happen when: the input expression evaluates to undefined, the AI agent calls a tool without proper arguments, or a required field is missing.',
            });
        }
        return query;
    }
    function validateEmbedDocumentsInput(documents, node) {
        if (!Array.isArray(documents)) {
            throw new n8n_workflow_1.NodeOperationError(node, 'Documents must be an array', {
                description: 'Expected an array of strings to embed.',
            });
        }
        const invalidIndex = documents.findIndex((doc) => doc === undefined || doc === null || doc === '');
        if (invalidIndex !== -1) {
            throw new n8n_workflow_1.NodeOperationError(node, `Invalid document at index ${invalidIndex}`, {
                description: `Document at index ${invalidIndex} is empty or undefined. All documents must be non-empty strings.`,
            });
        }
        return documents;
    }
});
//# sourceMappingURL=embeddings-input-validation.js.map