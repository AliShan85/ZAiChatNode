"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiChatModelTemplate = void 0;
const node_path_1 = __importDefault(require("node:path"));
const core_1 = require("../../../../core");
exports.openaiChatModelTemplate = (0, core_1.createTemplate)({
    name: 'OpenAI compatible chat model node',
    description: 'Chat model node for OpenAI-compatible providers',
    path: node_path_1.default.join(__dirname, 'template'),
});
//# sourceMappingURL=template.js.map