export declare class WorkflowHistoryCompactionConfig {
    optimizingMinimumAgeHours: number;
    optimizingTimeWindowHours: number;
    trimmingMinimumAgeDays: number;
    trimmingTimeWindowDays: number;
    batchSize: number;
    batchDelayMs: number;
    trimOnStartUp: boolean;
}
