import type { ISupplyDataFunctions, SupplyData } from 'n8n-workflow';
import type { ChatMemory } from '../types/memory';
export interface SupplyMemoryOptions {
    closeFunction?: () => Promise<void>;
}
export declare function supplyMemory(context: ISupplyDataFunctions, memory: ChatMemory, options?: SupplyMemoryOptions): SupplyData;
