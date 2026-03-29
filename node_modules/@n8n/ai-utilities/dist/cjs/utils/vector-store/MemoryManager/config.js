(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getConfig = getConfig;
    exports.mbToBytes = mbToBytes;
    exports.hoursToMs = hoursToMs;
    const DEFAULT_MAX_MEMORY_MB = -1;
    const DEFAULT_INACTIVE_TTL_HOURS = -1;
    function getConfig() {
        let maxMemoryMB = DEFAULT_MAX_MEMORY_MB;
        if (process.env.N8N_VECTOR_STORE_MAX_MEMORY) {
            const parsed = parseInt(process.env.N8N_VECTOR_STORE_MAX_MEMORY, 10);
            if (!isNaN(parsed)) {
                maxMemoryMB = parsed;
            }
        }
        let ttlHours = DEFAULT_INACTIVE_TTL_HOURS;
        if (process.env.N8N_VECTOR_STORE_TTL_HOURS) {
            const parsed = parseInt(process.env.N8N_VECTOR_STORE_TTL_HOURS, 10);
            if (!isNaN(parsed)) {
                ttlHours = parsed;
            }
        }
        return {
            maxMemoryMB,
            ttlHours,
        };
    }
    function mbToBytes(mb) {
        if (mb <= 0)
            return -1;
        return mb * 1024 * 1024;
    }
    function hoursToMs(hours) {
        if (hours <= 0)
            return -1;
        return hours * 60 * 60 * 1000;
    }
});
//# sourceMappingURL=config.js.map