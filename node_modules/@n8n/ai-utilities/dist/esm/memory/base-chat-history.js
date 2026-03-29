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
//# sourceMappingURL=base-chat-history.js.map