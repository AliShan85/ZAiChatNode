"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEncoding = getEncoding;
exports.encodingForModel = encodingForModel;
const promises_1 = require("fs/promises");
const lite_1 = require("js-tiktoken/lite");
const n8n_workflow_1 = require("n8n-workflow");
const path_1 = require("path");
const cache = {};
const loadJSONFile = async (filename) => {
    const filePath = (0, path_1.join)(__dirname, filename);
    const content = await (0, promises_1.readFile)(filePath, 'utf-8');
    return await (0, n8n_workflow_1.jsonParse)(content);
};
async function getEncoding(encoding) {
    if (!(encoding in cache)) {
        cache[encoding] = (async () => {
            let jsonData;
            switch (encoding) {
                case 'o200k_base':
                    jsonData = await loadJSONFile('./o200k_base.json');
                    break;
                case 'cl100k_base':
                    jsonData = await loadJSONFile('./cl100k_base.json');
                    break;
                default:
                    jsonData = await loadJSONFile('./cl100k_base.json');
            }
            return new lite_1.Tiktoken(jsonData);
        })().catch((error) => {
            delete cache[encoding];
            throw error;
        });
    }
    return await cache[encoding];
}
async function encodingForModel(model) {
    return await getEncoding((0, lite_1.getEncodingNameForModel)(model));
}
//# sourceMappingURL=tiktoken.js.map