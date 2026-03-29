"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataFiltersValues = getMetadataFiltersValues;
exports.hasLongSequentialRepeat = hasLongSequentialRepeat;
function getMetadataFiltersValues(ctx, itemIndex) {
    const options = ctx.getNodeParameter('options', itemIndex, {});
    if (options.metadata) {
        const { metadataValues: metadata } = options.metadata;
        if (metadata.length > 0) {
            return metadata.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
        }
    }
    if (options.searchFilterJson) {
        return ctx.getNodeParameter('options.searchFilterJson', itemIndex, '', {
            ensureType: 'object',
        });
    }
    return undefined;
}
function hasLongSequentialRepeat(text, threshold = 1000) {
    try {
        if (text === null ||
            typeof text !== 'string' ||
            text.length === 0 ||
            threshold <= 0 ||
            text.length < threshold) {
            return false;
        }
        const iterator = text[Symbol.iterator]();
        let prev = iterator.next();
        if (prev.done) {
            return false;
        }
        let count = 1;
        for (const char of iterator) {
            if (char === prev.value) {
                count++;
                if (count >= threshold) {
                    return true;
                }
            }
            else {
                count = 1;
                prev = { value: char, done: false };
            }
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
//# sourceMappingURL=helpers.js.map