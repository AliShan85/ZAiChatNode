import { NodeConnectionTypes } from 'n8n-workflow';
import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';
export declare const metadataFilterField: INodeProperties;
export declare function getTemplateNoticeField(templateId: number): INodeProperties;
export declare function getBatchingOptionFields(displayOptions: IDisplayOptions | undefined, defaultBatchSize?: number): INodeProperties;
type AllowedConnectionTypes = typeof NodeConnectionTypes.AiAgent | typeof NodeConnectionTypes.AiChain | typeof NodeConnectionTypes.AiDocument | typeof NodeConnectionTypes.AiVectorStore | typeof NodeConnectionTypes.AiRetriever;
export declare function getConnectionHintNoticeField(connectionTypes: AllowedConnectionTypes[]): INodeProperties;
export {};
