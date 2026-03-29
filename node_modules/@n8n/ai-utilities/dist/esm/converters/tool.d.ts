import type * as LangchainChatModels from '@langchain/core/language_models/chat_models';
import type { JSONSchema7 } from 'json-schema';
import type * as N8nTools from '../types/tool';
export declare function fromLcTool(tool: LangchainChatModels.BindToolsInput): N8nTools.Tool;
export declare function getParametersJsonSchema(tool: N8nTools.FunctionTool): JSONSchema7;
