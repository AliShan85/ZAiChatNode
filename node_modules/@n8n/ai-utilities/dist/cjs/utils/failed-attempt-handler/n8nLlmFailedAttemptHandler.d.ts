import type { FailedAttemptHandler } from '@langchain/core/dist/utils/async_caller';
import type { ISupplyDataFunctions } from 'n8n-workflow';
export declare const makeN8nLlmFailedAttemptHandler: (ctx: ISupplyDataFunctions, handler?: FailedAttemptHandler) => FailedAttemptHandler;
