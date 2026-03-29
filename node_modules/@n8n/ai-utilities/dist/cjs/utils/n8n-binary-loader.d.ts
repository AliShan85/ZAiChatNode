import type { Document } from '@langchain/core/documents';
import type { TextSplitter } from '@langchain/textsplitters';
import type { IExecuteFunctions, INodeExecutionData, ISupplyDataFunctions } from 'n8n-workflow';
export declare class N8nBinaryLoader {
    private context;
    private optionsPrefix;
    private binaryDataKey;
    private textSplitter?;
    constructor(context: IExecuteFunctions | ISupplyDataFunctions, optionsPrefix?: string, binaryDataKey?: string, textSplitter?: TextSplitter | undefined);
    processAll(items?: INodeExecutionData[]): Promise<Document[]>;
    private validateMimeType;
    private getFilePathOrBlob;
    private getLoader;
    private loadDocuments;
    private cleanupTmpFileIfNeeded;
    processItem(item: INodeExecutionData, itemIndex: number): Promise<Document[]>;
    processItemByKey(item: INodeExecutionData, itemIndex: number, binaryKey: string): Promise<Document[]>;
}
