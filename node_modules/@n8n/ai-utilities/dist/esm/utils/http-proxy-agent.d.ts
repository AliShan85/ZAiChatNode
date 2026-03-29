import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent, ProxyAgent } from 'undici';
export interface AgentTimeoutOptions {
    headersTimeout?: number;
    bodyTimeout?: number;
    connectTimeout?: number;
}
export declare function getProxyAgent(targetUrl?: string, timeoutOptions?: AgentTimeoutOptions): Agent | ProxyAgent | undefined;
export declare function proxyFetch(input: RequestInfo | URL, init?: RequestInit, timeoutOptions?: AgentTimeoutOptions): Promise<Response>;
export declare function getNodeProxyAgent(targetUrl?: string): HttpsProxyAgent<string> | undefined;
