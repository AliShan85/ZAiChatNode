"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAiEvent = logAiEvent;
const n8n_workflow_1 = require("n8n-workflow");
function logAiEvent(executeFunctions, event, data) {
    try {
        executeFunctions.logAiEvent(event, data ? (0, n8n_workflow_1.jsonStringify)(data) : undefined);
    }
    catch (error) {
        executeFunctions.logger.debug(`Error logging AI event: ${event}`);
    }
}
//# sourceMappingURL=log-ai-event.js.map