(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../adapters/langchain-memory", "../utils/log-wrapper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.supplyMemory = supplyMemory;
    const langchain_memory_1 = require("../adapters/langchain-memory");
    const log_wrapper_1 = require("../utils/log-wrapper");
    function supplyMemory(context, memory, options) {
        const adapter = new langchain_memory_1.LangchainMemoryAdapter(memory);
        const wrappedAdapter = (0, log_wrapper_1.logWrapper)(adapter, context);
        return {
            response: wrappedAdapter,
            closeFunction: options?.closeFunction,
        };
    }
});
//# sourceMappingURL=supplyMemory.js.map