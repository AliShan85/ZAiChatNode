import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import type { SerializedFields } from '@langchain/core/dist/load/map_keys';
import type { Serialized, SerializedNotImplemented, SerializedSecret } from '@langchain/core/load/serializable';
import type { BaseMessage } from '@langchain/core/messages';
import type { LLMResult } from '@langchain/core/outputs';
import type { IDataObject, ISupplyDataFunctions } from 'n8n-workflow';
import { NodeError } from 'n8n-workflow';
type TokensUsageParser = (result: LLMResult) => {
    completionTokens: number;
    promptTokens: number;
    totalTokens: number;
};
type RunDetail = {
    index: number;
    messages: BaseMessage[] | string[] | string;
    options: SerializedSecret | SerializedNotImplemented | SerializedFields;
};
export declare class N8nLlmTracing extends BaseCallbackHandler {
    #private;
    private executionFunctions;
    name: string;
    awaitHandlers: boolean;
    connectionType: "ai_languageModel";
    promptTokensEstimate: number;
    completionTokensEstimate: number;
    runsMap: Record<string, RunDetail>;
    options: {
        tokensUsageParser: (result: LLMResult) => {
            completionTokens: number;
            promptTokens: number;
            totalTokens: number;
        };
        errorDescriptionMapper: (error: NodeError) => string | null | undefined;
    };
    constructor(executionFunctions: ISupplyDataFunctions, options?: {
        tokensUsageParser?: TokensUsageParser;
        errorDescriptionMapper?: (error: NodeError) => string;
    });
    estimateTokensFromGeneration(generations: LLMResult['generations']): Promise<number>;
    estimateTokensFromStringList(list: string[]): Promise<number>;
    handleLLMEnd(output: LLMResult, runId: string): Promise<void>;
    handleLLMStart(llm: Serialized, prompts: string[], runId: string): Promise<void>;
    handleLLMError(error: IDataObject | Error, runId: string, parentRunId?: string): Promise<void>;
    setParentRunIndex(runIndex: number): void;
}
export {};
