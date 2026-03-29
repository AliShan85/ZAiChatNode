import type { Document } from '@langchain/core/documents';
import type { INodeExecutionData } from 'n8n-workflow';
import { N8nBinaryLoader } from '../n8n-binary-loader';
import { N8nJsonLoader } from '../n8n-json-loader';
export declare function processDocuments(documentInput: N8nJsonLoader | N8nBinaryLoader | Array<Document<Record<string, unknown>>>, inputItems: INodeExecutionData[]): Promise<{
    processedDocuments: Document<Record<string, any>>[];
    serializedDocuments: {
        json: {
            metadata: Record<string, any>;
            pageContent: string;
        };
    }[];
}>;
export declare function processDocument(documentInput: N8nJsonLoader | N8nBinaryLoader | Array<Document<Record<string, unknown>>>, inputItem: INodeExecutionData, itemIndex: number): Promise<{
    processedDocuments: Document<Record<string, any>>[];
    serializedDocuments: {
        json: {
            metadata: Record<string, any>;
            pageContent: string;
        };
        pairedItem: {
            item: number;
        };
    }[];
}>;
