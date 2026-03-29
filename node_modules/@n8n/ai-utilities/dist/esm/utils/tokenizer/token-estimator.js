"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateTokensByCharCount = estimateTokensByCharCount;
exports.estimateTextSplitsByTokens = estimateTextSplitsByTokens;
exports.estimateTokensFromStringList = estimateTokensFromStringList;
const tiktoken_1 = require("./tiktoken");
const helpers_1 = require("../helpers");
const MODEL_CHAR_PER_TOKEN_RATIOS = {
    'gpt-4o': 3.8,
    'gpt-4': 4.0,
    'gpt-3.5-turbo': 4.0,
    cl100k_base: 4.0,
    o200k_base: 3.5,
    p50k_base: 4.2,
    r50k_base: 4.2,
};
function estimateTokensByCharCount(text, model = 'cl100k_base') {
    try {
        if (!text || typeof text !== 'string' || text.length === 0) {
            return 0;
        }
        const charsPerToken = MODEL_CHAR_PER_TOKEN_RATIOS[model] || 4.0;
        if (!Number.isFinite(charsPerToken) || charsPerToken <= 0) {
            const estimatedTokens = Math.ceil(text.length / 4.0);
            return estimatedTokens;
        }
        const estimatedTokens = Math.ceil(text.length / charsPerToken);
        return estimatedTokens;
    }
    catch (error) {
        return Math.ceil((text?.length || 0) / 4.0);
    }
}
function estimateTextSplitsByTokens(text, chunkSize, chunkOverlap, model = 'cl100k_base') {
    try {
        if (!text || typeof text !== 'string' || text.length === 0) {
            return [];
        }
        if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
            return [text];
        }
        const validOverlap = Number.isFinite(chunkOverlap) && chunkOverlap >= 0
            ? Math.min(chunkOverlap, chunkSize - 1)
            : 0;
        const charsPerToken = MODEL_CHAR_PER_TOKEN_RATIOS[model] || 4.0;
        const chunkSizeInChars = Math.floor(chunkSize * charsPerToken);
        const overlapInChars = Math.floor(validOverlap * charsPerToken);
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            const end = Math.min(start + chunkSizeInChars, text.length);
            chunks.push(text.slice(start, end));
            if (end >= text.length) {
                break;
            }
            start = Math.max(end - overlapInChars, start + 1);
        }
        return chunks;
    }
    catch (error) {
        return text ? [text] : [];
    }
}
async function estimateTokensFromStringList(list, model) {
    try {
        if (!Array.isArray(list)) {
            return 0;
        }
        const encoder = await (0, tiktoken_1.encodingForModel)(model);
        const encodedListLength = await Promise.all(list.map(async (text) => {
            try {
                if (!text || typeof text !== 'string') {
                    return 0;
                }
                if ((0, helpers_1.hasLongSequentialRepeat)(text)) {
                    const estimatedTokens = estimateTokensByCharCount(text, model);
                    return estimatedTokens;
                }
                try {
                    const tokens = encoder.encode(text);
                    return tokens.length;
                }
                catch (encodingError) {
                    return estimateTokensByCharCount(text, model);
                }
            }
            catch (itemError) {
                return 0;
            }
        }));
        const totalTokens = encodedListLength.reduce((acc, curr) => acc + curr, 0);
        return totalTokens;
    }
    catch (error) {
        return 0;
    }
}
//# sourceMappingURL=token-estimator.js.map