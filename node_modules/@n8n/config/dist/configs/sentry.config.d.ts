import { z } from 'zod';
export declare const sampleRateSchema: z.ZodNumber;
export declare class SentryConfig {
    backendDsn: string;
    frontendDsn: string;
    tracesSampleRate: number;
    profilesSampleRate: number;
    eventLoopBlockThreshold: number;
    environment: string;
    deploymentName: string;
}
