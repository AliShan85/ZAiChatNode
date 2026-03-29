/** Returns true if `obj` is a deep lazy proxy created by createDeepLazyProxy. */
export declare function isLazyProxy(obj: unknown): boolean;
/** Returns the basePath the proxy was created with, or undefined if not a proxy. */
export declare function getProxyPath(obj: object): string[] | undefined;
/**
 * Creates a deep lazy-loading proxy for workflow data.
 *
 * This proxy system enables on-demand loading of nested properties across
 * the isolate boundary using metadata-driven callbacks.
 *
 * Pattern:
 * 1. When property accessed: Call __getValueAtPath([path]) to get metadata
 * 2. Metadata indicates type: primitive, object, array, or function
 * 3. For objects/arrays: Create nested proxy for lazy loading
 * 4. For functions: Create wrapper that calls __callFunctionAtPath
 * 5. Cache all fetched values in target to avoid repeated callbacks
 *
 * @param basePath - Current path in object tree (e.g., ['$json', 'user'])
 * @returns Proxy object with lazy loading behavior
 */
export declare function createDeepLazyProxy(basePath?: string[]): any;
//# sourceMappingURL=lazy-proxy.d.ts.map