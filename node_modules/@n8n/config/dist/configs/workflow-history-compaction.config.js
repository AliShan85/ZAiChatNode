"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowHistoryCompactionConfig = void 0;
const decorators_1 = require("../decorators");
let WorkflowHistoryCompactionConfig = class WorkflowHistoryCompactionConfig {
    constructor() {
        this.optimizingMinimumAgeHours = 0.25;
        this.optimizingTimeWindowHours = 2;
        this.trimmingMinimumAgeDays = 7;
        this.trimmingTimeWindowDays = 2;
        this.batchSize = 100;
        this.batchDelayMs = 1_000;
        this.trimOnStartUp = false;
    }
};
exports.WorkflowHistoryCompactionConfig = WorkflowHistoryCompactionConfig;
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_OPTIMIZING_MINIMUM_AGE_HOURS'),
    __metadata("design:type", Number)
], WorkflowHistoryCompactionConfig.prototype, "optimizingMinimumAgeHours", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_OPTIMIZING_TIME_WINDOW_HOURS'),
    __metadata("design:type", Number)
], WorkflowHistoryCompactionConfig.prototype, "optimizingTimeWindowHours", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_TRIMMING_MINIMUM_AGE_DAYS'),
    __metadata("design:type", Number)
], WorkflowHistoryCompactionConfig.prototype, "trimmingMinimumAgeDays", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_TRIMMING_TIME_WINDOW_DAYS'),
    __metadata("design:type", Number)
], WorkflowHistoryCompactionConfig.prototype, "trimmingTimeWindowDays", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_COMPACTION_BATCH_SIZE'),
    __metadata("design:type", Number)
], WorkflowHistoryCompactionConfig.prototype, "batchSize", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_COMPACTION_BATCH_DELAY_MS'),
    __metadata("design:type", Number)
], WorkflowHistoryCompactionConfig.prototype, "batchDelayMs", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_WORKFLOW_HISTORY_COMPACTION_TRIM_ON_START_UP'),
    __metadata("design:type", Boolean)
], WorkflowHistoryCompactionConfig.prototype, "trimOnStartUp", void 0);
exports.WorkflowHistoryCompactionConfig = WorkflowHistoryCompactionConfig = __decorate([
    decorators_1.Config
], WorkflowHistoryCompactionConfig);
//# sourceMappingURL=workflow-history-compaction.config.js.map