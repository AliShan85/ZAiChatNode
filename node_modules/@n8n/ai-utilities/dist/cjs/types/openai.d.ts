import type { ProviderTool } from './tool';
export type ReasoningEffort = 'none' | 'minimal' | 'low' | 'medium' | 'high' | null;
export type VerbosityParam = 'low' | 'medium' | 'high' | null;
export interface OpenAIModelOptions {
    baseUrl: string;
    model: string;
    apiKey: string;
    providerTools?: ProviderTool[];
    defaultHeaders?: Record<string, string>;
    useResponsesApi?: boolean;
    logprobs?: boolean;
    topLogprobs?: number;
    supportsStrictToolCalling?: boolean;
    reasoning?: {
        effort?: ReasoningEffort | null;
        summary?: 'auto' | 'concise' | 'detailed' | null;
    };
    zdrEnabled?: boolean;
    service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority' | null;
    promptCacheKey?: string;
    temperature?: number;
    maxTokens?: number;
    maxCompletionTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    n?: number;
    logitBias?: Record<string, number>;
    user?: string;
    streaming?: boolean;
    streamUsage?: boolean;
    additionalParams?: Record<string, unknown>;
    stop?: string[];
    stopSequences?: string[];
    timeout?: number;
    verbosity?: VerbosityParam;
    maxRetries?: number;
    onFailedAttempt?: (error: unknown) => void;
}
