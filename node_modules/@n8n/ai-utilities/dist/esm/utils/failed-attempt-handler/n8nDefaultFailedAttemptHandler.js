"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.n8nDefaultFailedAttemptHandler = void 0;
const STATUS_NO_RETRY = [
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    407,
    409,
];
const n8nDefaultFailedAttemptHandler = (error) => {
    if (error?.message?.startsWith?.('Cancel') ||
        error?.message?.startsWith?.('AbortError') ||
        error?.name === 'AbortError') {
        throw error;
    }
    if (error?.code === 'ECONNABORTED') {
        throw error;
    }
    const status = error?.response?.status ?? error?.status;
    if (status && STATUS_NO_RETRY.includes(+status)) {
        throw error;
    }
};
exports.n8nDefaultFailedAttemptHandler = n8nDefaultFailedAttemptHandler;
//# sourceMappingURL=n8nDefaultFailedAttemptHandler.js.map