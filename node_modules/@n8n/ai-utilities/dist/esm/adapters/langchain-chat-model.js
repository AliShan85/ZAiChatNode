"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangchainChatModelAdapter = void 0;
const chat_models_1 = require("@langchain/core/language_models/chat_models");
const messages_1 = require("@langchain/core/messages");
const outputs_1 = require("@langchain/core/outputs");
const message_1 = require("../converters/message");
const tool_1 = require("../converters/tool");
const n8nLlmFailedAttemptHandler_1 = require("../utils/failed-attempt-handler/n8nLlmFailedAttemptHandler");
const n8n_llm_tracing_1 = require("../utils/n8n-llm-tracing");
class LangchainChatModelAdapter extends chat_models_1.BaseChatModel {
    constructor(chatModel, ctx) {
        const params = {
            ...(ctx
                ? {
                    callbacks: [
                        new n8n_llm_tracing_1.N8nLlmTracing(ctx, {
                            tokensUsageParser: (result) => {
                                const tokenUsage = result?.llmOutput?.tokenUsage;
                                const completionTokens = tokenUsage?.output_tokens ?? 0;
                                const promptTokens = tokenUsage?.input_tokens ?? 0;
                                return {
                                    completionTokens,
                                    promptTokens,
                                    totalTokens: completionTokens + promptTokens,
                                };
                            },
                        }),
                    ],
                    onFailedAttempt: (0, n8nLlmFailedAttemptHandler_1.makeN8nLlmFailedAttemptHandler)(ctx),
                }
                : {}),
        };
        super(params);
        this.chatModel = chatModel;
        this.ctx = ctx;
    }
    _llmType() {
        return 'n8n-chat-model';
    }
    async _generate(messages, options) {
        const transformedMessages = messages.map(message_1.fromLcMessage);
        const result = await this.chatModel.generate(transformedMessages, options);
        const lcMessage = (0, message_1.toLcMessage)(result.message);
        const usage_metadata = result.usage
            ? {
                input_tokens: result.usage.promptTokens ?? 0,
                output_tokens: result.usage.completionTokens ?? 0,
                total_tokens: result.usage.totalTokens ?? 0,
                input_token_details: result.usage.inputTokenDetails
                    ? {
                        cache_read: result.usage.inputTokenDetails.cacheRead,
                    }
                    : undefined,
                output_token_details: result.usage.outputTokenDetails
                    ? {
                        reasoning: result.usage.outputTokenDetails.reasoning,
                    }
                    : undefined,
            }
            : undefined;
        if (messages_1.AIMessage.isInstance(lcMessage)) {
            lcMessage.usage_metadata = usage_metadata;
        }
        lcMessage.response_metadata = {
            ...result.providerMetadata,
            model: this.chatModel.modelId,
            provider: this.chatModel.provider,
        };
        return {
            generations: [
                {
                    text: lcMessage.text,
                    message: lcMessage,
                },
            ],
            llmOutput: {
                id: result.id,
                tokenUsage: usage_metadata,
            },
        };
    }
    async *_streamResponseChunks(messages, options, runManager) {
        const genericMessages = messages.map(message_1.fromLcMessage);
        const stream = this.chatModel.stream(genericMessages, options);
        for await (const chunk of stream) {
            let lcChunk = undefined;
            if (chunk.type === 'text-delta') {
                const content = [
                    {
                        type: 'text',
                        text: chunk.delta,
                    },
                ];
                lcChunk = new outputs_1.ChatGenerationChunk({
                    message: new messages_1.AIMessageChunk({
                        content,
                    }),
                    text: chunk.delta,
                });
            }
            else if (chunk.type === 'tool-call-delta') {
                const tool_call_chunks = [
                    {
                        type: 'tool_call_chunk',
                        id: chunk.id,
                        name: chunk.name,
                        args: chunk.argumentsDelta,
                        index: 0,
                    },
                ];
                lcChunk = new outputs_1.ChatGenerationChunk({
                    message: new messages_1.AIMessageChunk({
                        content: '',
                        tool_call_chunks,
                    }),
                    text: '',
                });
            }
            else if (chunk.type === 'finish') {
                const usage_metadata = chunk.usage
                    ? {
                        input_tokens: chunk.usage.promptTokens ?? 0,
                        output_tokens: chunk.usage.completionTokens ?? 0,
                        total_tokens: chunk.usage.totalTokens ?? 0,
                    }
                    : undefined;
                lcChunk = new outputs_1.ChatGenerationChunk({
                    message: new messages_1.AIMessageChunk({
                        content: '',
                        usage_metadata,
                        response_metadata: {
                            finish_reason: chunk.finishReason,
                        },
                    }),
                    text: '',
                    generationInfo: {
                        finish_reason: chunk.finishReason,
                    },
                });
            }
            else if (chunk.type === 'error') {
                lcChunk = new outputs_1.ChatGenerationChunk({
                    message: new messages_1.AIMessageChunk({
                        content: '',
                        response_metadata: {
                            finish_reason: 'error',
                            error: chunk.error,
                        },
                    }),
                    text: '',
                    generationInfo: {
                        finish_reason: 'error',
                        error: chunk.error,
                    },
                });
            }
            else if (chunk.type === 'content') {
                const lcMessage = (0, message_1.toLcMessage)({
                    role: 'assistant',
                    content: [chunk.content],
                    id: chunk.id,
                });
                const lcMessageChunk = new messages_1.AIMessageChunk({
                    content: lcMessage.content,
                    id: lcMessage.id,
                    name: lcMessage.name,
                });
                lcChunk = new outputs_1.ChatGenerationChunk({
                    message: lcMessageChunk,
                    text: lcMessage.text,
                });
            }
            if (lcChunk) {
                yield lcChunk;
                await runManager?.handleLLMNewToken(lcChunk.text ?? '', {
                    prompt: 0,
                    completion: 0,
                }, undefined, undefined, undefined, { chunk: lcChunk });
            }
        }
    }
    bindTools(tools) {
        const genericTools = tools.map(tool_1.fromLcTool);
        const newModel = this.chatModel.withTools(genericTools);
        const newAdapter = new LangchainChatModelAdapter(newModel, this.ctx);
        return newAdapter;
    }
}
exports.LangchainChatModelAdapter = LangchainChatModelAdapter;
//# sourceMappingURL=langchain-chat-model.js.map