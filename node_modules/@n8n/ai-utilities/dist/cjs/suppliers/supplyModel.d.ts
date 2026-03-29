import type { ISupplyDataFunctions, SupplyData } from 'n8n-workflow';
import type { ChatModel } from '../types/chat-model';
import type { OpenAIModelOptions } from '../types/openai';
export type OpenAiModel = OpenAIModelOptions & {
    type: 'openai';
};
export type SupplyModelOptions = ChatModel | OpenAiModel;
export declare function supplyModel(ctx: ISupplyDataFunctions, model: SupplyModelOptions): SupplyData;
