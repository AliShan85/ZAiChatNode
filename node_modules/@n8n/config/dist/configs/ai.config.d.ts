export declare class AiConfig {
    enabled: boolean;
    timeout: number;
    allowSendingParameterValues: boolean;
    persistBuilderSessions: boolean;
    get openAiDefaultHeaders(): Record<string, string>;
}
