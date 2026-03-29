"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeN8nLlmFailedAttemptHandler = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const n8nDefaultFailedAttemptHandler_1 = require("./n8nDefaultFailedAttemptHandler");
const makeN8nLlmFailedAttemptHandler = (ctx, handler) => {
    return (error) => {
        try {
            handler?.(error);
            (0, n8nDefaultFailedAttemptHandler_1.n8nDefaultFailedAttemptHandler)(error);
        }
        catch (e) {
            const apiError = new n8n_workflow_1.NodeApiError(ctx.getNode(), e, {
                functionality: 'configuration-node',
            });
            throw apiError;
        }
        if (error?.retriesLeft > 0) {
            return;
        }
        const apiError = new n8n_workflow_1.NodeApiError(ctx.getNode(), error, {
            functionality: 'configuration-node',
        });
        throw apiError;
    };
};
exports.makeN8nLlmFailedAttemptHandler = makeN8nLlmFailedAttemptHandler;
//# sourceMappingURL=n8nLlmFailedAttemptHandler.js.map