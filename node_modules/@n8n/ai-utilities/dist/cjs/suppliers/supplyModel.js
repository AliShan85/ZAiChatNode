(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/openai", "../adapters/langchain-chat-model", "../chat-model/base", "../utils/failed-attempt-handler/n8nLlmFailedAttemptHandler", "../utils/http-proxy-agent", "../utils/n8n-llm-tracing"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.supplyModel = supplyModel;
    const openai_1 = require("@langchain/openai");
    const langchain_chat_model_1 = require("../adapters/langchain-chat-model");
    const base_1 = require("../chat-model/base");
    const n8nLlmFailedAttemptHandler_1 = require("../utils/failed-attempt-handler/n8nLlmFailedAttemptHandler");
    const http_proxy_agent_1 = require("../utils/http-proxy-agent");
    const n8n_llm_tracing_1 = require("../utils/n8n-llm-tracing");
    function isOpenAiModel(model) {
        return 'type' in model && model.type === 'openai' && !(model instanceof base_1.BaseChatModel);
    }
    function getOpenAiModel(ctx, model) {
        const clientConfiguration = {
            baseURL: model.baseUrl,
        };
        if (model.defaultHeaders) {
            clientConfiguration.defaultHeaders = model.defaultHeaders;
        }
        const timeout = model.timeout;
        clientConfiguration.fetchOptions = {
            dispatcher: (0, http_proxy_agent_1.getProxyAgent)(model.baseUrl, {
                headersTimeout: timeout,
                bodyTimeout: timeout,
            }),
        };
        const openAiModel = new openai_1.ChatOpenAI({
            configuration: clientConfiguration,
            model: model.model,
            apiKey: model.apiKey,
            useResponsesApi: model.useResponsesApi,
            logprobs: model.logprobs,
            topLogprobs: model.topLogprobs,
            supportsStrictToolCalling: model.supportsStrictToolCalling,
            reasoning: model.reasoning,
            zdrEnabled: model.zdrEnabled,
            service_tier: model.service_tier,
            promptCacheKey: model.promptCacheKey,
            temperature: model.temperature,
            topP: model.topP,
            frequencyPenalty: model.frequencyPenalty,
            presencePenalty: model.presencePenalty,
            stopSequences: model.stopSequences,
            maxRetries: model.maxRetries,
            modelKwargs: model.additionalParams,
            verbosity: model.verbosity,
            streaming: model.streaming,
            streamUsage: model.streamUsage,
            stop: model.stop,
            maxTokens: model.maxTokens,
            maxCompletionTokens: model.maxCompletionTokens,
            timeout: model.timeout,
            callbacks: [new n8n_llm_tracing_1.N8nLlmTracing(ctx)],
            onFailedAttempt: (0, n8nLlmFailedAttemptHandler_1.makeN8nLlmFailedAttemptHandler)(ctx, model.onFailedAttempt),
        });
        if (model.providerTools?.length) {
            openAiModel.metadata = {
                ...openAiModel.metadata,
                tools: model.providerTools.map((tool) => ({
                    type: tool.name,
                    ...tool.args,
                })),
            };
        }
        return openAiModel;
    }
    function supplyModel(ctx, model) {
        if (isOpenAiModel(model)) {
            const openAiModel = getOpenAiModel(ctx, model);
            return {
                response: openAiModel,
            };
        }
        const adapter = new langchain_chat_model_1.LangchainChatModelAdapter(model, ctx);
        return {
            response: adapter,
        };
    }
});
//# sourceMappingURL=supplyModel.js.map