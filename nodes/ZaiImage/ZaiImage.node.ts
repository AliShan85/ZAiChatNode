import type {IExecuteFunctions, INodeType, INodeTypeDescription} from 'n8n-workflow';
import {NodeConnectionTypes, NodeOperationError} from 'n8n-workflow';
import {zaiImageProperties} from './properties';

export class ZaiImage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Z.ai Image',
		name: 'zaiImage',
		icon: {light: 'file:../../icons/zai.svg', dark: 'file:../../icons/zai.dark.svg'},
		group: ['transform'],
		version: [1],
		description: 'Generate images using Z.ai models (CogView-4, GLM-Image)',
		defaults: {
			name: 'Z.ai Image',
		},
		subtitle: '={{$parameter["model"]}}',
		codex: {
			categories: ['AI', 'Image Generation'],
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.z.ai',
					},
				],
			},
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'zaiApi',
				required: true,
			},
		],
		properties: zaiImageProperties,
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];
		const credentials = await this.getCredentials('zaiApi');
		const baseURL = credentials.host as string;

		for (let i = 0; i < items.length; i++) {
			const model = this.getNodeParameter('model', i) as string;
			const prompt = this.getNodeParameter('prompt', i) as string;
			const options = this.getNodeParameter('options', i, {}) as {
				timeout?: number;
				fileName?: string;
				quality?: string;
				userId?: string;
			};

			const isCogView = model === 'cogview-4-250304';

			// Get size from model-specific parameter
			const sizeParam = this.getNodeParameter(
				isCogView ? 'sizeCogView' : 'size',
				i,
			) as string;

			let size: string;
			if (sizeParam === 'custom') {
				const widthParam = isCogView ? 'customWidthCogView' : 'customWidth';
				const heightParam = isCogView ? 'customHeightCogView' : 'customHeight';
				const customWidth = this.getNodeParameter(widthParam, i) as number;
				const customHeight = this.getNodeParameter(heightParam, i) as number;
				const divisor = isCogView ? 16 : 32;

				if (customWidth % divisor !== 0 || customHeight % divisor !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`Custom dimensions must be multiples of ${divisor} for ${model}`,
						{itemIndex: i},
					);
				}

				size = `${customWidth}x${customHeight}`;
			} else {
				size = sizeParam;
			}

			// Build request body
			const requestBody: Record<string, string> = {model, prompt, size};
			if (options.quality) {
				requestBody.quality = options.quality;
			}
			if (options.userId) {
				requestBody.user_id = options.userId;
			}

			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'zaiApi',
				{
					url: `${baseURL}/api/paas/v4/images/generations`,
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: requestBody,
					timeout: options.timeout || undefined,
					json: true,
				},
			);

			const responseData = response?.data as
				| Array<{url?: string}>
				| undefined;

			if (!responseData || responseData.length === 0) {
				throw new NodeOperationError(
					this.getNode(),
					'No image data returned from Z.ai API',
					{itemIndex: i},
				);
			}

			const imageUrl = responseData[0].url;
			if (!imageUrl) {
				throw new NodeOperationError(
					this.getNode(),
					'No image URL returned from Z.ai API',
					{itemIndex: i},
				);
			}

			const imageResponse = await this.helpers.httpRequest({
				url: imageUrl,
				method: 'GET',
				encoding: 'arraybuffer',
				timeout: options.timeout || undefined,
			});

			const imageBuffer = Buffer.from(imageResponse);
			const imageFileName = options.fileName || `zai-image-${model}`;

			const binaryData = await this.helpers.prepareBinaryData(
				imageBuffer,
				`${imageFileName}.png`,
				'image/png',
			);

			returnData.push({
				json: {
					model,
					prompt,
					size,
					created: response.created,
					url: imageUrl,
					contentFilter: response.content_filter,
					fileName: `${imageFileName}.png`,
				},
				binary: {
					data: binaryData,
				},
			});
		}

		return [returnData];
	}
}
