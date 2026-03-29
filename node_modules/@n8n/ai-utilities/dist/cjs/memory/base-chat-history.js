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
    exports.BaseChatHistory = void 0;
    class BaseChatHistory {
        async addMessages(messages) {
            for (const msg of messages) {
                await this.addMessage(msg);
            }
        }
    }
    exports.BaseChatHistory = BaseChatHistory;
});
//# sourceMappingURL=base-chat-history.js.map