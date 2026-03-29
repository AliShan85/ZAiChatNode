(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/core/chat_history", "../converters/message"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LangchainHistoryAdapter = void 0;
    const chat_history_1 = require("@langchain/core/chat_history");
    const message_1 = require("../converters/message");
    class LangchainHistoryAdapter extends chat_history_1.BaseListChatMessageHistory {
        constructor(history) {
            super();
            this.history = history;
            this.lc_namespace = ['n8n', 'ai-utilities'];
        }
        async getMessages() {
            const messages = await this.history.getMessages();
            return messages.map(message_1.toLcMessage);
        }
        async addMessage(message) {
            await this.history.addMessage((0, message_1.fromLcMessage)(message));
        }
        async addMessages(messages) {
            await this.history.addMessages(messages.map(message_1.fromLcMessage));
        }
        async clear() {
            await this.history.clear();
        }
    }
    exports.LangchainHistoryAdapter = LangchainHistoryAdapter;
});
//# sourceMappingURL=langchain-history.js.map