(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "n8n-workflow"], factory);
    }
})(function (require, exports) {
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
});
//# sourceMappingURL=log-ai-event.js.map