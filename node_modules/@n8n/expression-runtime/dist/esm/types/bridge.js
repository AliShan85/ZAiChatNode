// ============================================================================
// Phase 1.1: Bridge Interface (CORE - IMPLEMENT FIRST)
//
// This is the main interface all environments must implement.
// Start here for CLI/backend (IsolatedVmBridge) or frontend (WebWorkerBridge).
// ============================================================================
/** Default values for BridgeConfig. Bridge implementations should use this as their baseline. */
export const DEFAULT_BRIDGE_CONFIG = {
    memoryLimit: 128,
    timeout: 5000,
    debug: false,
};
//# sourceMappingURL=bridge.js.map