var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/core/messages", "n8n-workflow"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromLcContent = fromLcContent;
    exports.fromLcMessage = fromLcMessage;
    exports.toLcContent = toLcContent;
    exports.toLcMessage = toLcMessage;
    const LangchainMessages = __importStar(require("@langchain/core/messages"));
    const n8n_workflow_1 = require("n8n-workflow");
    function isN8nTextBlock(block) {
        return block.type === 'text';
    }
    function isN8nReasoningBlock(block) {
        return block.type === 'reasoning';
    }
    function isN8nFileBlock(block) {
        return block.type === 'file';
    }
    function isN8nToolCallBlock(block) {
        return block.type === 'tool-call';
    }
    function isN8nInvalidToolCallBlock(block) {
        return block.type === 'invalid-tool-call';
    }
    function isN8nToolResultBlock(block) {
        return block.type === 'tool-result';
    }
    function isN8nCitationBlock(block) {
        return block.type === 'citation';
    }
    function isN8nProviderBlock(block) {
        return block.type === 'provider';
    }
    function fromLcRole(role) {
        switch (role) {
            case 'system':
                return 'system';
            case 'user':
                return 'user';
            case 'assistant':
                return 'assistant';
            case 'tool':
                return 'tool';
            default:
                return 'user';
        }
    }
    function isTextBlock(block) {
        return block.type === 'text';
    }
    function isReasoningBlock(block) {
        return block.type === 'reasoning';
    }
    function isFileBlock(block) {
        return (block.type === 'file' ||
            block.type === 'audio' ||
            block.type === 'video' ||
            block.type === 'image' ||
            block.type === 'text-plain');
    }
    function isToolCallBlock(block) {
        return block.type === 'tool_call';
    }
    function isInvalidToolCallBlock(block) {
        return block.type === 'invalid_tool_call';
    }
    function isToolResultBlock(block) {
        return block.type === 'server_tool_call_result';
    }
    function isCitationBlock(block) {
        return (typeof block === 'object' && block !== null && 'type' in block && block.type === 'citation');
    }
    function isNonStandardBlock(block) {
        return block.type === 'non_standard';
    }
    function fromLcContent(content) {
        if (typeof content === 'string') {
            return [
                {
                    type: 'text',
                    text: content,
                },
            ];
        }
        const blocks = Array.isArray(content) ? content : [content];
        return blocks
            .map((block) => {
            let content = null;
            if (isTextBlock(block)) {
                content = {
                    type: 'text',
                    text: block.text,
                };
            }
            else if (isReasoningBlock(block)) {
                content = {
                    type: 'reasoning',
                    text: block.reasoning,
                };
            }
            else if (isFileBlock(block)) {
                let metadata = {};
                if (block.metadata) {
                    metadata = block.metadata;
                }
                if ('url' in block) {
                    metadata.url = block.url;
                }
                if ('fileId' in block) {
                    metadata.fileId = block.fileId;
                }
                content = {
                    type: 'file',
                    mediaType: block.mimeType,
                    data: block.data,
                    providerMetadata: Object.keys(metadata).length > 0 ? metadata : undefined,
                };
            }
            else if (isToolCallBlock(block)) {
                content = {
                    type: 'tool-call',
                    toolCallId: block.id,
                    toolName: block.name,
                    input: JSON.stringify(block.args),
                };
            }
            else if (isInvalidToolCallBlock(block)) {
                content = {
                    type: 'invalid-tool-call',
                    toolCallId: block.id,
                    error: block.error,
                    args: block.args,
                    name: block.name,
                };
            }
            else if (isToolResultBlock(block)) {
                content = {
                    type: 'tool-result',
                    toolCallId: block.toolCallId,
                    result: block.output,
                    isError: block.status === 'error',
                };
            }
            else if (isCitationBlock(block)) {
                content = {
                    type: 'citation',
                    source: block.source,
                    url: block.url,
                    title: block.title,
                    startIndex: block.startIndex,
                    endIndex: block.endIndex,
                    text: block.citedText,
                };
            }
            else if (isNonStandardBlock(block)) {
                content = {
                    type: 'provider',
                    value: block.value,
                };
            }
            return content;
        })
            .filter((content) => content !== null);
    }
    function fromLcMessage(msg) {
        if (LangchainMessages.ToolMessage.isInstance(msg)) {
            const result = typeof msg.content === 'string' ? msg.content : fromLcContent(msg.content);
            return {
                role: 'tool',
                content: [
                    {
                        type: 'tool-result',
                        toolCallId: msg.tool_call_id,
                        result,
                        isError: msg.status === 'error',
                        providerMetadata: msg.metadata,
                    },
                ],
                id: msg.id,
                name: msg.name,
            };
        }
        if (LangchainMessages.AIMessage.isInstance(msg)) {
            const content = fromLcContent(msg.content);
            const toolsCalls = msg.tool_calls;
            if (toolsCalls?.length) {
                const mappedToolsCalls = toolsCalls.map((toolCall) => ({
                    type: 'tool-call',
                    toolCallId: toolCall.id,
                    toolName: toolCall.name,
                    input: JSON.stringify(toolCall.args),
                    providerMetadata: msg.response_metadata,
                }));
                content.push(...mappedToolsCalls);
            }
            return {
                role: 'assistant',
                content,
                id: msg.id,
                name: msg.name,
            };
        }
        if (LangchainMessages.SystemMessage.isInstance(msg)) {
            return {
                role: 'system',
                content: fromLcContent(msg.content),
                id: msg.id,
                name: msg.name,
            };
        }
        if (LangchainMessages.HumanMessage.isInstance(msg)) {
            return {
                role: 'user',
                content: fromLcContent(msg.content),
                id: msg.id,
                name: msg.name,
            };
        }
        if (LangchainMessages.BaseMessage.isInstance(msg)) {
            return {
                role: fromLcRole(msg.type),
                content: fromLcContent(msg.content),
                id: msg.id,
                name: msg.name,
            };
        }
        throw new Error(`Provided message is not a valid Langchain message: ${JSON.stringify(msg)}`);
    }
    function toLcContent(block) {
        if (isN8nTextBlock(block)) {
            return { type: 'text', text: block.text };
        }
        if (isN8nReasoningBlock(block)) {
            return { type: 'reasoning', reasoning: block.text };
        }
        if (isN8nFileBlock(block)) {
            const { url, fileId, ...rest } = block.providerMetadata ?? {};
            return {
                type: 'file',
                mimeType: block.mediaType ?? 'application/octet-stream',
                data: block.data,
                ...(url ? { url } : {}),
                ...(fileId ? { fileId } : {}),
                ...(Object.keys(rest).length > 0 ? { metadata: rest } : {}),
            };
        }
        if (isN8nToolCallBlock(block)) {
            return {
                type: 'tool_call',
                id: block.toolCallId,
                name: block.toolName,
                args: (0, n8n_workflow_1.jsonParse)(block.input, { fallbackValue: {} }),
            };
        }
        if (isN8nInvalidToolCallBlock(block)) {
            return {
                type: 'invalid_tool_call',
                id: block.toolCallId,
                error: block.error,
                args: block.args,
                name: block.name,
            };
        }
        if (isN8nToolResultBlock(block)) {
            return {
                type: 'server_tool_call_result',
                toolCallId: block.toolCallId,
                output: block.result,
                status: block.isError ? 'error' : 'success',
            };
        }
        if (isN8nCitationBlock(block)) {
            return {
                type: 'citation',
                source: block.source,
                url: block.url,
                title: block.title,
                startIndex: block.startIndex,
                endIndex: block.endIndex,
                citedText: block.text,
            };
        }
        if (isN8nProviderBlock(block)) {
            return {
                type: 'non_standard',
                value: block.value,
            };
        }
        throw new Error(`Failed to convert to Langchain content block: ${JSON.stringify(block)}`);
    }
    function toLcMessage(message) {
        const lcContent = message.content.map(toLcContent);
        switch (message.role) {
            case 'system':
                return new LangchainMessages.SystemMessage({
                    content: lcContent,
                    id: message.id,
                    name: message.name,
                });
            case 'user':
                return new LangchainMessages.HumanMessage({
                    content: lcContent,
                    id: message.id,
                    name: message.name,
                });
            case 'assistant': {
                const toolCalls = message.content
                    .filter(isN8nToolCallBlock)
                    .map((c) => ({
                    type: 'tool_call',
                    id: c.toolCallId,
                    name: c.toolName,
                    args: (0, n8n_workflow_1.jsonParse)(c.input, { fallbackValue: {} }),
                }));
                const nonToolContent = lcContent.filter((c) => c.type !== 'tool_call');
                return new LangchainMessages.AIMessage({
                    content: nonToolContent,
                    id: message.id,
                    name: message.name,
                    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
                });
            }
            case 'tool': {
                const toolResult = message.content.find(isN8nToolResultBlock);
                if (!toolResult) {
                    throw new Error('Tool message is missing a tool-result content block');
                }
                const content = typeof toolResult.result === 'string'
                    ? toolResult.result
                    : JSON.stringify(toolResult.result);
                return new LangchainMessages.ToolMessage({
                    content,
                    tool_call_id: toolResult.toolCallId,
                    name: message.name,
                    status: toolResult.isError ? 'error' : 'success',
                });
            }
            default:
                return new LangchainMessages.HumanMessage({
                    content: lcContent,
                    id: message.id,
                    name: message.name,
                });
        }
    }
});
//# sourceMappingURL=message.js.map