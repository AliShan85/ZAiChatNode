import { CommaSeparatedStringArray } from '../custom-types';
export declare const SSRF_DEFAULT_BLOCKED_IP_RANGES: readonly string[];
export declare class SsrfProtectionConfig {
    enabled: boolean;
    blockedIpRanges: string[];
    allowedIpRanges: CommaSeparatedStringArray<string>;
    allowedHostnames: CommaSeparatedStringArray<string>;
    dnsCacheMaxSize: number;
}
