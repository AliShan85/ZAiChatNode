(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/core/tools", "n8n-workflow", "zod"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractFromAIParameters = extractFromAIParameters;
    exports.createZodSchemaFromArgs = createZodSchemaFromArgs;
    exports.createToolFromNode = createToolFromNode;
    const tools_1 = require("@langchain/core/tools");
    const n8n_workflow_1 = require("n8n-workflow");
    const zod_1 = require("zod");
    function extractFromAIParameters(nodeParameters) {
        const collectedArguments = [];
        (0, n8n_workflow_1.traverseNodeParameters)(nodeParameters, collectedArguments);
        const uniqueArgsMap = new Map();
        for (const arg of collectedArguments) {
            uniqueArgsMap.set(arg.key, arg);
        }
        return Array.from(uniqueArgsMap.values());
    }
    function createZodSchemaFromArgs(args) {
        const schemaObj = args.reduce((acc, placeholder) => {
            acc[placeholder.key] = (0, n8n_workflow_1.generateZodSchema)(placeholder);
            return acc;
        }, {});
        return zod_1.z.object(schemaObj).required();
    }
    function createToolFromNode(node, options) {
        const { name, description, func, extraArgs = [] } = options;
        const collectedArguments = extractFromAIParameters(node.parameters);
        if (collectedArguments.length === 0 && extraArgs.length === 0) {
            return new tools_1.DynamicTool({ name, description, func });
        }
        const allArguments = [...collectedArguments, ...extraArgs];
        const schema = createZodSchemaFromArgs(allArguments);
        return new tools_1.DynamicStructuredTool({ schema, name, description, func });
    }
});
//# sourceMappingURL=fromai-tool-factory.js.map