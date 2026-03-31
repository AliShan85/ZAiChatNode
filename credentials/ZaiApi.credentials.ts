import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZaiApi implements ICredentialType {
	name = 'zaiApi';

	displayName = 'Zai API';

	icon: Icon = { light: 'file:../icons/zai.svg', dark: 'file:../icons/zai.dark.svg' };

	documentationUrl = 'https://docs.zai.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'https://api.z.ai',
			description: 'Base URL for the Z.AI API',
		},
		{
			displayName: 'Allowed HTTP Request Domains',
			name: 'allowedDomains',
			type: 'string',
			default: '',
			placeholder: 'e.g. api.zai.ai, *.zai.ai',
			description: 'Comma-separated list for CORS/security',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.host}}',
			url: '/api/paas/v4/models',
			method: 'GET',
		},
	};
}