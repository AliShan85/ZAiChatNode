import type { Document } from '@langchain/core/documents';
import type { TextSplitter } from '@langchain/textsplitters';
import { type IExecuteFunctions, type INodeExecutionData, type ISupplyDataFunctions } from 'n8n-workflow';
export declare class N8nJsonLoader {
    private context;
    private optionsPrefix;
    private textSplitter?;
    constructor(context: IExecuteFunctions | ISupplyDataFunctions, optionsPrefix?: string, textSplitter?: TextSplitter | undefined);
    processAll(items?: INodeExecutionData[]): Promise<Document[]>;
    processItem(item: INodeExecutionData, itemIndex: number): Promise<Document[]>;
}
