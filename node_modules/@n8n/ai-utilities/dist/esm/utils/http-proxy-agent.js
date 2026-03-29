"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyAgent = getProxyAgent;
exports.proxyFetch = proxyFetch;
exports.getNodeProxyAgent = getNodeProxyAgent;
const https_proxy_agent_1 = require("https-proxy-agent");
const proxy_from_env_1 = __importDefault(require("proxy-from-env"));
const undici_1 = require("undici");
const DEFAULT_TIMEOUT = parseInt(process.env.N8N_AI_TIMEOUT_MAX ?? '3600000', 10);
function getProxyUrlFromEnv(targetUrl) {
    return proxy_from_env_1.default.getProxyForUrl(targetUrl ?? 'https://example.nonexistent/');
}
function getProxyAgent(targetUrl, timeoutOptions) {
    const proxyUrl = getProxyUrlFromEnv(targetUrl);
    const agentOptions = {
        headersTimeout: timeoutOptions?.headersTimeout ?? DEFAULT_TIMEOUT,
        bodyTimeout: timeoutOptions?.bodyTimeout ?? DEFAULT_TIMEOUT,
        ...(timeoutOptions?.connectTimeout !== undefined && {
            connectTimeout: timeoutOptions.connectTimeout,
        }),
    };
    if (!proxyUrl) {
        if (timeoutOptions) {
            return new undici_1.Agent(agentOptions);
        }
        return undefined;
    }
    return new undici_1.ProxyAgent({ uri: proxyUrl, ...agentOptions });
}
async function proxyFetch(input, init, timeoutOptions) {
    const targetUrl = input instanceof Request ? input.url : input.toString();
    const dispatcher = getProxyAgent(targetUrl, timeoutOptions);
    return await fetch(input, {
        ...init,
        dispatcher,
    });
}
function getNodeProxyAgent(targetUrl) {
    const proxyUrl = getProxyUrlFromEnv(targetUrl);
    if (!proxyUrl) {
        return undefined;
    }
    return new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
}
//# sourceMappingURL=http-proxy-agent.js.map