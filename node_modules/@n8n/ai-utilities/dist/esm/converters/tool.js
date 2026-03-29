"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromLcTool = fromLcTool;
exports.getParametersJsonSchema = getParametersJsonSchema;
const zod_1 = require("zod");
const zod_to_json_schema_1 = __importDefault(require("zod-to-json-schema"));
function fromLcTool(tool) {
    if ('schema' in tool && 'invoke' in tool) {
        const structuredTool = tool;
        return {
            type: 'function',
            name: structuredTool.name,
            description: structuredTool.description,
            inputSchema: structuredTool.schema,
        };
    }
    if ('schema' in tool && 'func' in tool) {
        const structuredTool = tool;
        return {
            type: 'function',
            name: structuredTool.name,
            description: structuredTool.description,
            inputSchema: structuredTool.schema,
        };
    }
    if ('name' in tool && 'schema' in tool) {
        const structuredTool = tool;
        return {
            type: 'function',
            name: structuredTool.name,
            description: structuredTool.description,
            inputSchema: structuredTool.schema,
        };
    }
    if ('function' in tool && 'type' in tool && tool.type === 'function') {
        const functionTool = tool.function;
        return {
            type: 'function',
            name: functionTool.name,
            description: functionTool.description,
            inputSchema: functionTool.parameters,
        };
    }
    throw new Error(`Unable to convert tool to N8nTool: ${JSON.stringify(tool)}`);
}
function getParametersJsonSchema(tool) {
    const schema = tool.inputSchema;
    if (schema instanceof zod_1.ZodSchema) {
        if ('toJSONSchema' in schema && typeof schema.toJSONSchema === 'function') {
            return schema.toJSONSchema();
        }
        return (0, zod_to_json_schema_1.default)(schema);
    }
    return schema;
}
//# sourceMappingURL=tool.js.map