import type { IDataObject } from 'n8n-workflow';
import type { ProviderTool } from '@n8n/ai-node-sdk';

/**
 * Convert comma-separated string to array
 */
const toArray = (str: string) =>
	str
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean);

/**
 * Format built-in tools for API request
 */
export const formatBuiltInTools = (builtInTools: IDataObject): ProviderTool[] => {
	const tools: ProviderTool[] = [];

	if (builtInTools) {
		const webSearchOptions = builtInTools.webSearch as IDataObject;
		if (webSearchOptions) {
			let allowedDomains: string[] | undefined;
			const allowedDomainsRaw = webSearchOptions.allowedDomains as string;
			if (allowedDomainsRaw) {
				allowedDomains = toArray(allowedDomainsRaw);
			}

			tools.push({
				type: 'provider',
				name: 'web_search',
				args: {
					search_context_size: webSearchOptions.searchContextSize as string,
					...(allowedDomains && { filters: { allowed_domains: allowedDomains } }),
				},
			});
		}
	}

	return tools;
};
