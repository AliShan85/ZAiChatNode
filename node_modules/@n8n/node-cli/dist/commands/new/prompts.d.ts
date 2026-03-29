export declare const nodeNamePrompt: () => Promise<string>;
export declare const nodeTypePrompt: () => Promise<"declarative" | "programmatic">;
export declare const declarativeTemplatePrompt: () => Promise<"custom" | "githubIssues">;
export declare const programmaticNodeTypePrompt: () => Promise<"basic" | "chatModel" | "chatMemory">;
export declare const chatModelTypePrompt: () => Promise<"custom" | "openaiCompatible" | "customExample">;
