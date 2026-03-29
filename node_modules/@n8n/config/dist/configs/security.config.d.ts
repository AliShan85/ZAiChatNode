import z from 'zod';
declare const crossOriginOpenerPolicySchema: z.ZodEnum<["same-origin", "same-origin-allow-popups"]>;
export declare class SecurityConfig {
    restrictFileAccessTo: string;
    blockFileAccessToN8nFiles: boolean;
    blockFilePatterns: string;
    daysAbandonedWorkflow: number;
    contentSecurityPolicy: string;
    contentSecurityPolicyReportOnly: boolean;
    crossOriginOpenerPolicy: z.infer<typeof crossOriginOpenerPolicySchema>;
    disableWebhookHtmlSandboxing: boolean;
    disableBareRepos: boolean;
    awsSystemCredentialsAccess: boolean;
    enableGitNodeHooks: boolean;
    enableGitNodeAllConfigKeys: boolean;
}
export {};
