(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@n8n/tournament"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExpressionEvaluator = void 0;
    const tournament_1 = require("@n8n/tournament");
    class ExpressionEvaluator {
        config;
        disposed = false;
        // Lazy-initialized tournament instance (expensive to create, reused across evaluations)
        tournament;
        // Cache: template expression → tournament-transformed JavaScript code
        // Cache hit rate in production: ~99.9% (same expressions repeat within a workflow)
        codeCache = new Map();
        constructor(config) {
            this.config = config;
        }
        async initialize() {
            await this.config.bridge.initialize();
        }
        evaluate(expression, data, options) {
            if (this.disposed)
                throw new Error('Evaluator disposed');
            // Transform template expression → sanitized JavaScript (cached)
            const transformedCode = this.getTransformedCode(expression);
            try {
                const result = this.config.bridge.execute(transformedCode, data, {
                    timezone: options?.timezone,
                });
                if (this.config.observability) {
                    this.config.observability.metrics.counter('expression.evaluation.success', 1);
                }
                return result;
            }
            catch (error) {
                if (this.config.observability) {
                    this.config.observability.metrics.counter('expression.evaluation.error', 1);
                }
                throw error;
            }
        }
        /**
         * Transform a template expression to executable JavaScript via tournament.
         *
         * Input:  "{{ $json.email }}"
         * Output: JavaScript string with tournament security transforms applied
         *         ($json → this.$json, computed access wrapped in this.__sanitize(), etc.)
         *
         * Result is cached by expression string (tournament AST parsing is expensive).
         */
        getTransformedCode(expression) {
            const cached = this.codeCache.get(expression);
            if (cached !== undefined) {
                return cached;
            }
            if (!this.tournament) {
                // Tournament requires an errorHandler but we only use getExpressionCode()
                // for AST transformation — we never call tournament.execute(), so this
                // handler is never invoked. Runtime errors are handled by the bridge's
                // own E() injection in injectErrorHandler().
                const errorHandler = () => { };
                this.tournament = new tournament_1.Tournament(errorHandler, undefined, undefined, {
                    before: this.config.hooks?.before ?? [],
                    after: this.config.hooks?.after ?? [],
                });
            }
            const [transformedCode] = this.tournament.getExpressionCode(expression);
            this.codeCache.set(expression, transformedCode);
            return transformedCode;
        }
        async dispose() {
            this.disposed = true;
            this.codeCache.clear();
            await this.config.bridge.dispose();
        }
        isDisposed() {
            return this.disposed;
        }
    }
    exports.ExpressionEvaluator = ExpressionEvaluator;
});
//# sourceMappingURL=expression-evaluator.js.map