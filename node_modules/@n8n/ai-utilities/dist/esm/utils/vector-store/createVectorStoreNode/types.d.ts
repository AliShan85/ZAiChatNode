import type { Document } from '@langchain/core/documents';
import type { Embeddings } from '@langchain/core/embeddings';
import type { VectorStore } from '@langchain/core/vectorstores';
import type { ICredentialTestFunction, IExecuteFunctions, INodeCredentialDescription, INodeProperties, ILoadOptionsFunctions, INodeListSearchResult, Icon, ISupplyDataFunctions, ThemeIconColor, IDataObject, NodeParameterValueType, IBuilderHint } from 'n8n-workflow';
export type NodeOperationMode = 'insert' | 'load' | 'retrieve' | 'update' | 'retrieve-as-tool';
export interface NodeMeta {
    displayName: string;
    name: string;
    hidden?: boolean;
    description: string;
    docsUrl: string;
    icon: Icon;
    iconColor?: ThemeIconColor;
    credentials?: INodeCredentialDescription[];
    operationModes?: NodeOperationMode[];
    categories?: string[];
    subcategories?: Record<string, string[]>;
    builderHint?: IBuilderHint;
}
export interface VectorStoreNodeConstructorArgs<T extends VectorStore = VectorStore> {
    meta: NodeMeta;
    methods?: {
        listSearch?: {
            [key: string]: (this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<INodeListSearchResult>;
        };
        actionHandler?: {
            [functionName: string]: (this: ILoadOptionsFunctions, payload: IDataObject | string | undefined) => Promise<NodeParameterValueType>;
        };
        credentialTest?: {
            [functionName: string]: ICredentialTestFunction;
        };
    };
    sharedFields: INodeProperties[];
    insertFields?: INodeProperties[];
    loadFields?: INodeProperties[];
    retrieveFields?: INodeProperties[];
    updateFields?: INodeProperties[];
    hidden?: true;
    beforeInsert?: (context: IExecuteFunctions | ISupplyDataFunctions, embeddings: Embeddings, itemIndex: number) => Promise<void>;
    populateVectorStore: (context: IExecuteFunctions | ISupplyDataFunctions, embeddings: Embeddings, documents: Array<Document<Record<string, unknown>>>, itemIndex: number) => Promise<void>;
    getVectorStoreClient: (context: IExecuteFunctions | ISupplyDataFunctions, filter: Record<string, never> | undefined, embeddings: Embeddings, itemIndex: number) => Promise<T>;
    releaseVectorStoreClient?: (vectorStore: T) => void;
}
