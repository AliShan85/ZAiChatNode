import type {
    INodeType,
    INodeTypeDescription,
    ISupplyDataFunctions,
    IDataObject,
} from 'n8n-workflow';
import {NodeConnectionTypes} from 'n8n-workflow';
import {supplyModel} from '@n8n/ai-node-sdk';
import {ZaiChatModel} from './model';
import {zaiChatProperties} from './properties';
import {formatBuiltInTools} from './common';

type ModelOptions = {
    temperature?: number;
    maxTokens?: number;
    topK?: number;
    topP?: number;
    safetySettings?: Array<{ safetyCategory: string; safetyThreshold: string }>;
    timeout?: number;
};

export class ZaiChat implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Z.ai Chat',
        name: 'zaiChat',
        icon: {light: 'file:../../icons/zai.svg', dark: 'file:../../icons/zai.dark.svg'},
        group: ['transform'],
        version: [1],
        description: 'Converse with Zai AI language models',
        defaults: {
            name: 'Z.ai Chat',
        },
        subtitle: '={{$parameter["model"]}}',
        codex: {
            categories: ['assistant'],
            resources: {
                primaryDocumentation: [
                    {
                        url: 'https://docs.z.ai',
                    },
                ],
            },
        },
        inputs: [],
        outputs: [NodeConnectionTypes.AiLanguageModel],
        outputNames: ['Model'],
        credentials: [
            {
                name: 'zaiApi',
                required: true,
            },
        ],
        properties: zaiChatProperties,
    };

    async supplyData(this: ISupplyDataFunctions, itemIndex: number) {
        const credentials = await this.getCredentials('zaiApi');
        const modelParam = this.getNodeParameter('model', itemIndex) as string;
        const options = this.getNodeParameter('options', itemIndex, {}) as ModelOptions;
        const builtInTools = this.getNodeParameter('builtInTools', itemIndex, {}) as IDataObject;

        // Use custom model name if selected
        const modelName =
            modelParam === 'custom'
                ? (this.getNodeParameter('customModel', itemIndex) as string)
                : modelParam;

        // Format built-in tools
        const providerTools = formatBuiltInTools(builtInTools);

        const model = new ZaiChatModel(
            modelName,
            {
                httpRequest: async (method, url, body, headers) => {
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'zaiApi',
                        {
                            url,
                            method,
                            body,
                            headers,
                            timeout: options.timeout,
                        },
                    );
                    return {body: response};
                },
                openStream: async (method, url, body, headers) => {
                    const response = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'zaiApi',
                        {
                            method,
                            url,
                            body,
                            headers,
                            timeout: options.timeout,
                            encoding: 'stream',
                        },
                    );
                    return {body: response};
                },
            },
            {
                baseURL: credentials.host as string,
                apiKey: credentials.apiKey as string,
                providerTools,
                temperature: options.temperature,
                maxTokens: options.maxTokens,
                topK: options.topK,
                topP: options.topP,
                safetySettings:
                    Array.isArray(options.safetySettings) && options.safetySettings.length > 0
                        ? options.safetySettings.map(
                            (setting: { safetyCategory: string; safetyThreshold: string }) => ({
                                category: setting.safetyCategory,
                                threshold: setting.safetyThreshold,
                            }),
                        )
                        : undefined,
            },
        );

        return supplyModel(this, model);
    }
}
