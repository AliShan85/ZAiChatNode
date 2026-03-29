(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@langchain/community/memory/chat_memory", "./langchain-history", "../converters/message"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LangchainMemoryAdapter = void 0;
    const chat_memory_1 = require("@langchain/community/memory/chat_memory");
    const langchain_history_1 = require("./langchain-history");
    const message_1 = require("../converters/message");
    class LangchainMemoryAdapter extends chat_memory_1.BaseChatMemory {
        constructor(memory) {
            super({
                chatHistory: new langchain_history_1.LangchainHistoryAdapter(memory.chatHistory),
                returnMessages: true,
                inputKey: 'input',
                outputKey: 'output',
            });
            this.memory = memory;
        }
        get memoryKeys() {
            return ['chat_history'];
        }
        async loadMemoryVariables(_values) {
            const messages = await this.memory.loadMessages();
            return {
                chat_history: messages.map(message_1.toLcMessage),
            };
        }
        async saveContext(inputValues, outputValues) {
            const input = String(inputValues.input ?? '');
            const output = String(outputValues.output ?? '');
            await this.memory.saveTurn(input, output);
        }
        async clear() {
            await this.memory.clear();
        }
    }
    exports.LangchainMemoryAdapter = LangchainMemoryAdapter;
});
//# sourceMappingURL=langchain-memory.js.map