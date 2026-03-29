import type { TiktokenModel } from 'js-tiktoken';
export declare function estimateTokensByCharCount(text: string, model?: string): number;
export declare function estimateTextSplitsByTokens(text: string, chunkSize: number, chunkOverlap: number, model?: string): string[];
export declare function estimateTokensFromStringList(list: string[], model: TiktokenModel): Promise<number>;
