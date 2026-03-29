(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./base-chat-memory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WindowedChatMemory = void 0;
    const base_chat_memory_1 = require("./base-chat-memory");
    class WindowedChatMemory extends base_chat_memory_1.BaseChatMemory {
        constructor(chatHistory, config) {
            super();
            this.chatHistory = chatHistory;
            this.windowSize = config?.windowSize ?? 10;
        }
        async loadMessages() {
            const allMessages = await this.chatHistory.getMessages();
            if (allMessages.length === 0) {
                return [];
            }
            const maxMessages = this.windowSize * 2;
            if (allMessages.length <= maxMessages) {
                return allMessages;
            }
            return allMessages.slice(-maxMessages);
        }
        async saveTurn(input, output) {
            const humanMessage = {
                role: 'user',
                content: [{ type: 'text', text: input }],
            };
            const aiMessage = {
                role: 'assistant',
                content: [{ type: 'text', text: output }],
            };
            await this.chatHistory.addMessages([humanMessage, aiMessage]);
        }
        async clear() {
            await this.chatHistory.clear();
        }
    }
    exports.WindowedChatMemory = WindowedChatMemory;
});
//# sourceMappingURL=windowed-chat-memory.js.map