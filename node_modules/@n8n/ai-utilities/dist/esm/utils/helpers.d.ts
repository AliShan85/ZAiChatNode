import type { IExecuteFunctions, ISupplyDataFunctions } from 'n8n-workflow';
export declare function getMetadataFiltersValues(ctx: IExecuteFunctions | ISupplyDataFunctions, itemIndex: number): Record<string, never> | undefined;
export declare function hasLongSequentialRepeat(text: string, threshold?: number): boolean;
