"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModelTypePrompt = exports.programmaticNodeTypePrompt = exports.declarativeTemplatePrompt = exports.nodeTypePrompt = exports.nodeNamePrompt = void 0;
const prompts_1 = require("@clack/prompts");
const templates_1 = require("../../template/templates");
const prompts_2 = require("../../utils/prompts");
const validation_1 = require("../../utils/validation");
const nodeNamePrompt = async () => await (0, prompts_2.withCancelHandler)((0, prompts_1.text)({
    message: "Package name (must start with 'n8n-nodes-' or '@org/n8n-nodes-')",
    placeholder: 'n8n-nodes-my-app',
    validate: validation_1.validateNodeName,
    defaultValue: 'n8n-nodes-my-app',
}));
exports.nodeNamePrompt = nodeNamePrompt;
const nodeTypePrompt = async () => await (0, prompts_2.withCancelHandler)((0, prompts_1.select)({
    message: 'What kind of node are you building?',
    options: [
        {
            label: 'HTTP API',
            value: 'declarative',
            hint: 'Low-code, faster approval for n8n Cloud',
        },
        {
            label: 'Programmatic',
            value: 'programmatic',
            hint: 'Programmatic node with full flexibility',
        },
    ],
    initialValue: 'declarative',
}));
exports.nodeTypePrompt = nodeTypePrompt;
const declarativeTemplatePrompt = async () => await (0, prompts_2.withCancelHandler)((0, prompts_1.select)({
    message: 'What template do you want to use?',
    options: Object.entries(templates_1.templates.declarative).map(([value, template]) => ({
        value: value,
        label: template.name,
        hint: template.description,
    })),
    initialValue: 'githubIssues',
}));
exports.declarativeTemplatePrompt = declarativeTemplatePrompt;
const programmaticNodeTypePrompt = async () => await (0, prompts_2.withCancelHandler)((0, prompts_1.select)({
    message: 'What type of programmatic node are you building?',
    options: [
        {
            label: 'Basic',
            value: 'basic',
            hint: 'Standard programmatic node',
        },
        {
            label: 'Chat Model (preview)',
            value: 'chatModel',
            hint: 'AI chat model node',
        },
        {
            label: 'Chat Memory (preview)',
            value: 'chatMemory',
            hint: 'AI chat memory node',
        },
    ],
    initialValue: 'basic',
}));
exports.programmaticNodeTypePrompt = programmaticNodeTypePrompt;
const chatModelTypePrompt = async () => await (0, prompts_2.withCancelHandler)((0, prompts_1.select)({
    message: 'What type of chat model?',
    options: [
        {
            label: 'OpenAI compatible',
            value: 'openaiCompatible',
            hint: 'Chat model for OpenAI-compatible providers',
        },
        {
            label: 'Custom',
            value: 'custom',
            hint: 'Custom chat model implementation',
        },
        {
            label: 'Custom Example',
            value: 'customExample',
            hint: 'OpenAI chat model example implementation',
        },
    ],
    initialValue: 'openaiCompatible',
}));
exports.chatModelTypePrompt = chatModelTypePrompt;
//# sourceMappingURL=prompts.js.map