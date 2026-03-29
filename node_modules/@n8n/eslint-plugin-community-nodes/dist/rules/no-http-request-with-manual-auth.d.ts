/**
 * Flags `this.helpers.httpRequest()` in functions that also call `this.getCredentials()`.
 * Those functions should use `this.helpers.httpRequestWithAuthentication()` instead.
 *
 * Uses a function-scope stack: if both `getCredentials` and `httpRequest` appear in
 * the same function body, every `httpRequest` call is reported. Nested functions are
 * checked independently.
 *
 * Alternatives considered:
 * - Checking for credential variables in `httpRequest` arguments — misses the common
 *   pattern where options are built in a separate variable first.
 * - Matching auth header names (`Authorization`, etc.) — brittle and requires deep
 *   AST traversal with no guarantee of coverage.
 *
 * Known false positive: a function that fetches credentials for a non-HTTP purpose
 * and also makes an unauthenticated request. Use eslint-disable to suppress.
 */
export declare const NoHttpRequestWithManualAuthRule: import("@typescript-eslint/utils/ts-eslint").RuleModule<"useHttpRequestWithAuthentication", [], unknown, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
//# sourceMappingURL=no-http-request-with-manual-auth.d.ts.map