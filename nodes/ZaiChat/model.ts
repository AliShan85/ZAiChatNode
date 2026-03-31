import type { IHttpRequestMethods } from 'n8n-workflow';
import {
	BaseChatModel,
	parseSSEStream,
	type TokenUsage,
	type ChatModelConfig,
	type GenerateResult,
	type Message,
	type MessageContent,
	type ProviderTool,
	type StreamChunk,
	type FinishReason,
} from '@n8n/ai-node-sdk';

// Types for Zai API
export interface SafetySetting {
	category: string;
	threshold: string;
}

export interface ZaiChatRequest {
	model: string;
	messages: Array<{ role: string; content: string }>;
	max_tokens?: number;
	temperature?: number;
	top_k?: number;
	top_p?: number;
	stream?: boolean;
	safety_settings?: SafetySetting[];
}

export interface ZaiChatResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: { role: string; content: string };
		finish_reason: string;
	}>;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

export interface ZaiChatModelConfig extends ChatModelConfig {
	apiKey?: string;
	baseURL?: string;
	providerTools?: ProviderTool[];
	topK?: number;
	safetySettings?: SafetySetting[];
}

export interface RequestConfig {
	httpRequest: (
		method: IHttpRequestMethods,
		url: string,
		body?: object,
		headers?: Record<string, string>,
	) => Promise<{ body: unknown }>;
	openStream: (
		method: IHttpRequestMethods,
		url: string,
		body?: object,
		headers?: Record<string, string>,
	) => Promise<{ body: AsyncIterableIterator<Buffer | Uint8Array> }>;
}

export class ZaiChatModel extends BaseChatModel<ZaiChatModelConfig> {
	private readonly baseURL: string;

	constructor(
		modelId: string,
		private readonly requests: RequestConfig,
		config?: ZaiChatModelConfig,
	) {
		super('zai', modelId, config);
		this.baseURL = config?.baseURL ?? 'https://api.z.ai';
	}

	/**
	 * Convert n8n messages to Zai format
	 */
	private messagesToZaiFormat(messages: Message[]): Array<{ role: string; content: string }> {
		return messages
			.filter((msg) => msg.role !== 'tool') // Skip tool messages for now
			.map((msg) => ({
				role: msg.role,
				content: msg.content
					.filter((c) => c.type === 'text')
					.map((c) => (c.type === 'text' ? c.text : ''))
					.join('\n'),
			}));
	}

	/**
	 * Convert Zai response to n8n format
	 */
	private parseZaiResponse(response: ZaiChatResponse): {
		text: string;
		finishReason: FinishReason;
		usage?: TokenUsage;
	} {
		const choice = response.choices[0];
		return {
			text: choice.message.content,
			finishReason: choice.finish_reason as FinishReason,
			usage: response.usage
				? {
						promptTokens: response.usage.prompt_tokens,
						completionTokens: response.usage.completion_tokens,
						totalTokens: response.usage.total_tokens,
					}
				: undefined,
		};
	}

	/**
	 * Generate a chat completion
	 */
	async generate(messages: Message[], config?: ZaiChatModelConfig): Promise<GenerateResult> {
		const merged = this.mergeConfig(config);

		const requestBody: ZaiChatRequest = {
			model: this.modelId,
			messages: this.messagesToZaiFormat(messages),
			max_tokens: merged.maxTokens,
			temperature: merged.temperature,
			top_k: merged.topK,
			top_p: merged.topP,
			stream: false,
			safety_settings: config?.safetySettings,
		};

		try {
			const response = await this.requests.httpRequest(
				'POST',
				`${this.baseURL}/api/paas/v4/chat/completions`,
				requestBody,
			);

			const body = response.body as ZaiChatResponse;
			const { text, finishReason, usage } = this.parseZaiResponse(body);

			const content: MessageContent[] = [{ type: 'text', text }];

			const message: Message = {
				role: 'assistant',
				content,
				id: body.id,
			};

			return {
				id: body.id,
				finishReason,
				usage,
				message,
				rawResponse: body,
				providerMetadata: {
					model_provider: 'zai',
					model: body.model,
					created: body.created,
					object: body.object,
				},
			};
		} catch (error) {
			// Provide helpful error messages
			if (error instanceof Error) {
				if (error.message.includes('401')) {
					throw new Error('Authentication failed: Check your API key');
				}
				if (error.message.includes('429')) {
					throw new Error('Rate limit exceeded: Please try again later');
				}
				if (error.message.includes('404')) {
					throw new Error('Model not found: Check your model name');
				}
			}
			throw error;
		}
	}

	/**
	 * Generate a streaming chat completion
	 */
	async *stream(messages: Message[], config?: ZaiChatModelConfig): AsyncIterable<StreamChunk> {
		const merged = this.mergeConfig(config);

		const requestBody: ZaiChatRequest = {
			model: this.modelId,
			messages: this.messagesToZaiFormat(messages),
			max_tokens: merged.maxTokens,
			temperature: merged.temperature,
			top_k: merged.topK,
			top_p: merged.topP,
			stream: true,
			safety_settings: config?.safetySettings,
		};

		try {
			const streamResponse = await this.requests.openStream(
				'POST',
				`${this.baseURL}/api/paas/v4/chat/completions`,
				requestBody,
			);

			const streamBody = streamResponse.body;

			// Parse SSE stream
			for await (const message of parseSSEStream(streamBody)) {
				if (!message.data) continue;
				if (message.data === '[DONE]') {
					yield { type: 'finish', finishReason: 'stop' as FinishReason };
					break;
				}

				try {
					const event = JSON.parse(message.data);

					// Handle streaming delta
					if (event.choices?.[0]?.delta?.content) {
						yield {
							type: 'text-delta',
							delta: event.choices[0].delta.content,
						};
					}

					// Handle finish
					if (event.choices?.[0]?.finish_reason) {
						yield {
							type: 'finish',
							finishReason: event.choices[0].finish_reason as FinishReason,
							usage: event.usage
								? {
										promptTokens: event.usage.prompt_tokens,
										completionTokens: event.usage.completion_tokens,
										totalTokens: event.usage.total_tokens,
									}
								: undefined,
						};
					}
				} catch {
					// Skip invalid JSON
					continue;
				}
			}
		} catch (error) {
			// Provide helpful error messages
			if (error instanceof Error) {
				if (error.message.includes('401')) {
					throw new Error('Authentication failed: Check your API key');
				}
				if (error.message.includes('429')) {
					throw new Error('Rate limit exceeded: Please try again later');
				}
				if (error.message.includes('404')) {
					throw new Error('Model not found: Check your model name');
				}
			}
			throw error;
		}
	}
}
