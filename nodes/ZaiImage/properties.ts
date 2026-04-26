import type {INodeProperties} from 'n8n-workflow';

export const zaiImageProperties: Array<INodeProperties> = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		description: 'The Z.AI image generation model to use',
		options: [
			{
				name: 'GLM-Image',
				value: 'glm-image',
				description: 'GLM-Image model for high-quality image generation',
			},
			{
				name: 'CogView-4',
				value: 'cogview-4-250304',
				description: 'CogView-4 model for fast image generation',
			},
		],
		default: 'glm-image',
		required: true,
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		description: 'The text description of the image to generate',
		placeholder: 'A cute kitten sitting on a sunny windowsill',
	},
	// GLM-Image sizes
	{
		displayName: 'Size',
		name: 'size',
		type: 'options',
		description: 'The resolution of the generated image',
		displayOptions: {
			show: {
				model: ['glm-image'],
			},
		},
		options: [
			{name: '1280 x 1280 (Square)', value: '1280x1280'},
			{name: '1568 x 1056 (Landscape)', value: '1568x1056'},
			{name: '1056 x 1568 (Portrait)', value: '1056x1568'},
			{name: '1472 x 1088 (Landscape)', value: '1472x1088'},
			{name: '1088 x 1472 (Portrait)', value: '1088x1472'},
			{name: '1728 x 960 (Wide)', value: '1728x960'},
			{name: '960 x 1728 (Tall)', value: '960x1728'},
			{name: 'Custom', value: 'custom'},
		],
		default: '1280x1280',
	},
	// GLM-Image custom dimensions
	{
		displayName: 'Custom Width',
		name: 'customWidth',
		type: 'number',
		displayOptions: {
			show: {
				model: ['glm-image'],
				size: ['custom'],
			},
		},
		typeOptions: {
			minValue: 1024,
			maxValue: 2048,
		},
		default: 1280,
		description: 'Image width in pixels (1024-2048, must be a multiple of 32)',
	},
	{
		displayName: 'Custom Height',
		name: 'customHeight',
		type: 'number',
		displayOptions: {
			show: {
				model: ['glm-image'],
				size: ['custom'],
			},
		},
		typeOptions: {
			minValue: 1024,
			maxValue: 2048,
		},
		default: 1280,
		description: 'Image height in pixels (1024-2048, must be a multiple of 32)',
	},
	// CogView-4 sizes
	{
		displayName: 'Size',
		name: 'sizeCogView',
		type: 'options',
		description: 'The resolution of the generated image',
		displayOptions: {
			show: {
				model: ['cogview-4-250304'],
			},
		},
		options: [
			{name: '1024 x 1024 (Square)', value: '1024x1024'},
			{name: '768 x 1344 (Portrait)', value: '768x1344'},
			{name: '864 x 1152 (Portrait)', value: '864x1152'},
			{name: '1344 x 768 (Landscape)', value: '1344x768'},
			{name: '1152 x 864 (Landscape)', value: '1152x864'},
			{name: '1440 x 720 (Wide)', value: '1440x720'},
			{name: '720 x 1440 (Tall)', value: '720x1440'},
			{name: 'Custom', value: 'custom'},
		],
		default: '1024x1024',
	},
	// CogView-4 custom dimensions
	{
		displayName: 'Custom Width',
		name: 'customWidthCogView',
		type: 'number',
		displayOptions: {
			show: {
				model: ['cogview-4-250304'],
				sizeCogView: ['custom'],
			},
		},
		typeOptions: {
			minValue: 512,
			maxValue: 2048,
		},
		default: 1024,
		description: 'Image width in pixels (512-2048, must be a multiple of 16)',
	},
	{
		displayName: 'Custom Height',
		name: 'customHeightCogView',
		type: 'number',
		displayOptions: {
			show: {
				model: ['cogview-4-250304'],
				sizeCogView: ['custom'],
			},
		},
		typeOptions: {
			minValue: 512,
			maxValue: 2048,
		},
		default: 1024,
		description: 'Image height in pixels (512-2048, must be a multiple of 16)',
	},
	// Options
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add Option',
		type: 'collection',
		default: {},
		options: [
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'options',
				description: 'hd: More detailed, ~20s | standard: Faster, ~5-10s',
				options: [
					{name: 'HD', value: 'hd'},
					{name: 'Standard', value: 'standard'},
				],
				default: 'hd',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Unique end-user ID for abuse prevention (6-128 characters)',
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				description: 'Custom file name for the output image',
				placeholder: 'my-image',
			},
			{
				displayName: 'Request Timeout (Ms)',
				name: 'timeout',
				type: 'number',
				typeOptions: {minValue: 0, maxValue: 700000},
				default: 0,
				description: 'Time in milliseconds to wait for the request to complete. Set to 0 for no timeout.',
			},
		],
	},
];
