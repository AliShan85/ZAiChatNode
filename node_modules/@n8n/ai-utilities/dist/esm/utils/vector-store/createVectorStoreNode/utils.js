"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDescriptionForOperationMode = transformDescriptionForOperationMode;
exports.isUpdateSupported = isUpdateSupported;
exports.getOperationModeOptions = getOperationModeOptions;
const constants_1 = require("./constants");
function transformDescriptionForOperationMode(fields, mode) {
    return fields.map((field) => ({
        ...field,
        displayOptions: { show: { mode: Array.isArray(mode) ? mode : [mode] } },
    }));
}
function isUpdateSupported(args) {
    return args.meta.operationModes?.includes('update') ?? false;
}
function getOperationModeOptions(args) {
    const enabledOperationModes = args.meta.operationModes ?? constants_1.DEFAULT_OPERATION_MODES;
    return constants_1.OPERATION_MODE_DESCRIPTIONS.filter(({ value }) => enabledOperationModes.includes(value));
}
//# sourceMappingURL=utils.js.map