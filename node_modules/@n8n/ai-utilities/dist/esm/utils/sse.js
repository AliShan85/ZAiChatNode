"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSSEStream = parseSSEStream;
async function* parseSSEStream(body) {
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = {};
    let dataLines = [];
    for await (const chunk of body) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split(/\r\n|\r|\n/);
        buffer = lines.pop() ?? '';
        for (const line of lines) {
            const event = processLine(line);
            if (event) {
                yield event;
            }
        }
    }
    buffer += decoder.decode();
    if (buffer !== '') {
        const event = processLine(buffer);
        if (event) {
            yield event;
        }
    }
    if (hasEventContent()) {
        yield finalizeEvent();
    }
    function processLine(line) {
        if (line === '') {
            if (hasEventContent()) {
                const event = finalizeEvent();
                currentEvent = {};
                dataLines = [];
                return event;
            }
            return null;
        }
        if (line.startsWith(':')) {
            currentEvent.comment = line.slice(1).trimStart();
            return null;
        }
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            processField(line, '');
            return null;
        }
        const fieldName = line.slice(0, colonIndex);
        let fieldValue = line.slice(colonIndex + 1);
        if (fieldValue.startsWith(' ')) {
            fieldValue = fieldValue.slice(1);
        }
        processField(fieldName, fieldValue);
        return null;
    }
    function processField(name, value) {
        switch (name) {
            case 'event': {
                currentEvent.event = value;
                break;
            }
            case 'data': {
                dataLines.push(value);
                break;
            }
            case 'id': {
                if (value) {
                    const numId = Number(value);
                    currentEvent.id = Number.isNaN(numId) ? value : numId;
                }
                break;
            }
            case 'retry': {
                const retryValue = Number.parseInt(value, 10);
                if (!Number.isNaN(retryValue) && retryValue >= 0) {
                    currentEvent.retry = retryValue;
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    function hasEventContent() {
        return !!(currentEvent.event || dataLines.length > 0 || currentEvent.id || currentEvent.retry);
    }
    function finalizeEvent() {
        const finalData = dataLines.join('\n');
        return {
            ...currentEvent,
            data: finalData ? finalData : undefined,
        };
    }
}
//# sourceMappingURL=sse.js.map