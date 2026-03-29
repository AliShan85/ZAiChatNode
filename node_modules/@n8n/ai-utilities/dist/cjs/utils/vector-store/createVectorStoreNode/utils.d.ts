import type { VectorStore } from '@langchain/core/vectorstores';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { NodeOperationMode, VectorStoreNodeConstructorArgs } from './types';
export declare function transformDescriptionForOperationMode(fields: INodeProperties[], mode: NodeOperationMode | NodeOperationMode[]): INodeProperties[];
export declare function isUpdateSupported<T extends VectorStore>(args: VectorStoreNodeConstructorArgs<T>): boolean;
export declare function getOperationModeOptions<T extends VectorStore>(args: VectorStoreNodeConstructorArgs<T>): INodePropertyOptions[];
