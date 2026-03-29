import type { IExpressionEvaluator, EvaluatorConfig, WorkflowData, EvaluateOptions } from '../types';
export declare class ExpressionEvaluator implements IExpressionEvaluator {
    private config;
    private disposed;
    private tournament?;
    private codeCache;
    constructor(config: EvaluatorConfig);
    initialize(): Promise<void>;
    evaluate(expression: string, data: WorkflowData, options?: EvaluateOptions): unknown;
    /**
     * Transform a template expression to executable JavaScript via tournament.
     *
     * Input:  "{{ $json.email }}"
     * Output: JavaScript string with tournament security transforms applied
     *         ($json → this.$json, computed access wrapped in this.__sanitize(), etc.)
     *
     * Result is cached by expression string (tournament AST parsing is expensive).
     */
    private getTransformedCode;
    dispose(): Promise<void>;
    isDisposed(): boolean;
}
//# sourceMappingURL=expression-evaluator.d.ts.map