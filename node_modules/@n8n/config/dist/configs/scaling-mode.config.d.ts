declare class HealthConfig {
    active: boolean;
    port: number;
    address: string;
}
declare class RedisConfig {
    db: number;
    host: string;
    password: string;
    port: number;
    timeoutThreshold: number;
    slotsRefreshTimeout: number;
    slotsRefreshInterval: number;
    username: string;
    clusterNodes: string;
    tls: boolean;
    dnsResolveStrategy: 'LOOKUP' | 'NONE';
    dualStack: boolean;
    keepAlive: boolean;
    keepAliveDelay: number;
    keepAliveInterval: number;
    reconnectOnFailover: boolean;
}
declare class SettingsConfig {
    lockDuration: number;
    lockRenewTime: number;
    stalledInterval: number;
}
declare class BullConfig {
    prefix: string;
    redis: RedisConfig;
    gracefulShutdownTimeout: number;
    settings: SettingsConfig;
}
export declare class ScalingModeConfig {
    health: HealthConfig;
    bull: BullConfig;
}
export {};
