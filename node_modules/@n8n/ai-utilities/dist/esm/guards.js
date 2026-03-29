"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBaseChatMemory = isBaseChatMemory;
exports.isBaseChatMessageHistory = isBaseChatMessageHistory;
exports.isChatInstance = isChatInstance;
exports.isToolsInstance = isToolsInstance;
function hasMethods(obj, ...methodNames) {
    return methodNames.every((methodName) => typeof obj === 'object' &&
        obj !== null &&
        methodName in obj &&
        typeof obj[methodName] === 'function');
}
function isBaseChatMemory(obj) {
    return hasMethods(obj, 'loadMemoryVariables', 'saveContext');
}
function isBaseChatMessageHistory(obj) {
    return hasMethods(obj, 'getMessages', 'addMessage');
}
function isChatInstance(model) {
    const namespace = model?.lc_namespace ?? [];
    return namespace.includes('chat_models');
}
function isToolsInstance(model) {
    const namespace = model?.lc_namespace ?? [];
    return namespace.includes('tools');
}
//# sourceMappingURL=guards.js.map