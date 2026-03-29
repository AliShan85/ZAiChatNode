import type { VectorStore } from '@langchain/core/vectorstores';
import type { IExecuteFunctions, INodeExecutionData, INodeTypeDescription, SupplyData, ISupplyDataFunctions } from 'n8n-workflow';
import type { VectorStoreNodeConstructorArgs } from './types';
export declare const createVectorStoreNode: <T extends VectorStore = VectorStore>(args: VectorStoreNodeConstructorArgs<T>) => {
    new (): {
        description: INodeTypeDescription;
        methods: {
            listSearch?: {
                [key: string]: (this: import("n8n-workflow").ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<import("n8n-workflow").INodeListSearchResult>;
            };
            actionHandler?: {
                [functionName: string]: (this: import("n8n-workflow").ILoadOptionsFunctions, payload: import("n8n-workflow").IDataObject | string | undefined) => Promise<import("n8n-workflow").NodeParameterValueType>;
            };
            credentialTest?: {
                [functionName: string]: import("n8n-workflow").ICredentialTestFunction;
            };
        } | undefined;
        execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
        supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData>;
    };
};
