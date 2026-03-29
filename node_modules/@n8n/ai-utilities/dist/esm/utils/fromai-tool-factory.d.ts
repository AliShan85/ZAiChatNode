import type { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager';
import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';
import type { FromAIArgument, IDataObject, INode, INodeParameters } from 'n8n-workflow';
import { z } from 'zod';
export type ToolFunc = (query: string | IDataObject, runManager?: CallbackManagerForToolRun) => Promise<string | IDataObject | IDataObject[]>;
export interface CreateToolOptions {
    name: string;
    description: string;
    func: ToolFunc;
    extraArgs?: FromAIArgument[];
}
export declare function extractFromAIParameters(nodeParameters: INodeParameters): FromAIArgument[];
export declare function createZodSchemaFromArgs(args: FromAIArgument[]): z.ZodObject<z.ZodRawShape>;
export declare function createToolFromNode(node: INode, options: CreateToolOptions): DynamicStructuredTool | DynamicTool;
