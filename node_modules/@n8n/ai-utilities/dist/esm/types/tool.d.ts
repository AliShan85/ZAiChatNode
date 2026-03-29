import type { JSONSchema7 } from 'json-schema';
import type { ZodTypeAny, ZodEffects, ZodSchema } from 'zod';
export interface FunctionTool {
    type: 'function';
    name: string;
    description?: string;
    inputSchema: JSONSchema7 | ZodSchema<any> | ZodEffects<ZodTypeAny>;
    strict?: boolean;
    providerOptions?: Record<string, unknown>;
}
export interface ProviderTool<TArgs extends Record<string, unknown> = Record<string, unknown>> {
    type: 'provider';
    name: string;
    args?: TArgs;
}
export type Tool = FunctionTool | ProviderTool;
export interface ToolCall {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
    argumentsRaw?: string;
}
export interface ToolResult {
    toolCallId: string;
    toolName: string;
    result: unknown;
    status: 'success' | 'error';
}
