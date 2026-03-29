(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseChatModel = void 0;
    class BaseChatModel {
        constructor(provider, modelId, defaultConfig, tools = []) {
            this.provider = provider;
            this.modelId = modelId;
            this.defaultConfig = defaultConfig;
            this.tools = tools;
        }
        withTools(tools) {
            const newInstance = Object.create(Object.getPrototypeOf(this));
            Object.assign(newInstance, this);
            newInstance.tools = [...this.tools, ...tools];
            return newInstance;
        }
        mergeConfig(config) {
            return {
                ...this.defaultConfig,
                ...config,
            };
        }
    }
    exports.BaseChatModel = BaseChatModel;
});
//# sourceMappingURL=base.js.map