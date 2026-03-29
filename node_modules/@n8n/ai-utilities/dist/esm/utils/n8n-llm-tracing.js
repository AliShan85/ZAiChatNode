"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _N8nLlmTracing_parentRunIndex;
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nLlmTracing = void 0;
const base_1 = require("@langchain/core/callbacks/base");
const base_2 = require("@langchain/core/language_models/base");
const pick_1 = __importDefault(require("lodash/pick"));
const n8n_workflow_1 = require("n8n-workflow");
const log_ai_event_1 = require("./log-ai-event");
const token_estimator_1 = require("./tokenizer/token-estimator");
const TIKTOKEN_ESTIMATE_MODEL = 'gpt-4o';
class N8nLlmTracing extends base_1.BaseCallbackHandler {
    constructor(executionFunctions, options) {
        super();
        this.executionFunctions = executionFunctions;
        this.name = 'N8nLlmTracing';
        this.awaitHandlers = true;
        this.connectionType = n8n_workflow_1.NodeConnectionTypes.AiLanguageModel;
        this.promptTokensEstimate = 0;
        this.completionTokensEstimate = 0;
        _N8nLlmTracing_parentRunIndex.set(this, void 0);
        this.runsMap = {};
        this.options = {
            tokensUsageParser: (result) => {
                const completionTokens = result?.llmOutput?.tokenUsage?.completionTokens ?? 0;
                const promptTokens = result?.llmOutput?.tokenUsage?.promptTokens ?? 0;
                return {
                    completionTokens,
                    promptTokens,
                    totalTokens: completionTokens + promptTokens,
                };
            },
            errorDescriptionMapper: (error) => error.description,
        };
        this.options = { ...this.options, ...options };
    }
    async estimateTokensFromGeneration(generations) {
        const messages = generations.flatMap((gen) => gen.map((g) => g.text));
        return await this.estimateTokensFromStringList(messages);
    }
    async estimateTokensFromStringList(list) {
        const embeddingModel = (0, base_2.getModelNameForTiktoken)(TIKTOKEN_ESTIMATE_MODEL);
        return await (0, token_estimator_1.estimateTokensFromStringList)(list, embeddingModel);
    }
    async handleLLMEnd(output, runId) {
        const runDetails = this.runsMap[runId] ?? { index: Object.keys(this.runsMap).length };
        output.generations = output.generations.map((gen) => gen.map((g) => (0, pick_1.default)(g, ['text', 'generationInfo'])));
        const tokenUsageEstimate = {
            completionTokens: 0,
            promptTokens: 0,
            totalTokens: 0,
        };
        const tokenUsage = this.options.tokensUsageParser(output);
        if (output.generations.length > 0) {
            tokenUsageEstimate.completionTokens = await this.estimateTokensFromGeneration(output.generations);
            tokenUsageEstimate.promptTokens = this.promptTokensEstimate;
            tokenUsageEstimate.totalTokens =
                tokenUsageEstimate.completionTokens + this.promptTokensEstimate;
        }
        const response = {
            response: { generations: output.generations },
        };
        if (tokenUsage.completionTokens > 0) {
            response.tokenUsage = tokenUsage;
        }
        else {
            response.tokenUsageEstimate = tokenUsageEstimate;
        }
        const parsedMessages = typeof runDetails.messages === 'string'
            ? runDetails.messages
            : runDetails.messages.map((message) => {
                if (typeof message === 'string')
                    return message;
                if (typeof message?.toJSON === 'function')
                    return message.toJSON();
                return message;
            });
        const sourceNodeRunIndex = __classPrivateFieldGet(this, _N8nLlmTracing_parentRunIndex, "f") !== undefined ? __classPrivateFieldGet(this, _N8nLlmTracing_parentRunIndex, "f") + runDetails.index : undefined;
        this.executionFunctions.addOutputData(this.connectionType, runDetails.index, [[{ json: { ...response } }]], undefined, sourceNodeRunIndex);
        (0, log_ai_event_1.logAiEvent)(this.executionFunctions, 'ai-llm-generated-output', {
            messages: parsedMessages,
            options: runDetails.options,
            response,
        });
    }
    async handleLLMStart(llm, prompts, runId) {
        const estimatedTokens = await this.estimateTokensFromStringList(prompts);
        const sourceNodeRunIndex = __classPrivateFieldGet(this, _N8nLlmTracing_parentRunIndex, "f") !== undefined
            ? __classPrivateFieldGet(this, _N8nLlmTracing_parentRunIndex, "f") + this.executionFunctions.getNextRunIndex()
            : undefined;
        const options = llm.type === 'constructor' ? llm.kwargs : llm;
        const { index } = this.executionFunctions.addInputData(this.connectionType, [
            [
                {
                    json: {
                        messages: prompts,
                        estimatedTokens,
                        options,
                    },
                },
            ],
        ], sourceNodeRunIndex);
        this.runsMap[runId] = {
            index,
            options,
            messages: prompts,
        };
        this.promptTokensEstimate = estimatedTokens;
    }
    async handleLLMError(error, runId, parentRunId) {
        const runDetails = this.runsMap[runId] ?? { index: Object.keys(this.runsMap).length };
        if (typeof error === 'object' && error?.hasOwnProperty('headers')) {
            const errorWithHeaders = error;
            Object.keys(errorWithHeaders.headers).forEach((key) => {
                if (!key.startsWith('x-')) {
                    delete errorWithHeaders.headers[key];
                }
            });
        }
        if (error instanceof n8n_workflow_1.NodeError) {
            if (this.options.errorDescriptionMapper) {
                error.description = this.options.errorDescriptionMapper(error);
            }
            this.executionFunctions.addOutputData(this.connectionType, runDetails.index, error);
        }
        else {
            this.executionFunctions.addOutputData(this.connectionType, runDetails.index, new n8n_workflow_1.NodeOperationError(this.executionFunctions.getNode(), error, {
                functionality: 'configuration-node',
            }));
        }
        (0, log_ai_event_1.logAiEvent)(this.executionFunctions, 'ai-llm-errored', {
            error: Object.keys(error).length === 0 ? error.toString() : error,
            runId,
            parentRunId,
        });
    }
    setParentRunIndex(runIndex) {
        __classPrivateFieldSet(this, _N8nLlmTracing_parentRunIndex, runIndex, "f");
    }
}
exports.N8nLlmTracing = N8nLlmTracing;
_N8nLlmTracing_parentRunIndex = new WeakMap();
//# sourceMappingURL=n8n-llm-tracing.js.map