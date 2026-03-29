import { z } from 'zod';
declare const dbLoggingOptionsSchema: z.ZodEnum<["query", "error", "schema", "warn", "info", "log", "all"]>;
type DbLoggingOptions = z.infer<typeof dbLoggingOptionsSchema>;
declare class LoggingConfig {
    enabled: boolean;
    options: DbLoggingOptions;
    maxQueryExecutionTime: number;
}
declare class PostgresSSLConfig {
    enabled: boolean;
    ca: string;
    cert: string;
    key: string;
    rejectUnauthorized: boolean;
}
declare class PostgresConfig {
    database: string;
    host: string;
    password: string;
    port: number;
    user: string;
    schema: string;
    poolSize: number;
    connectionTimeoutMs: number;
    idleTimeoutMs: number;
    statementTimeoutMs: number;
    ssl: PostgresSSLConfig;
}
export declare class SqliteConfig {
    database: string;
    poolSize: number;
    executeVacuumOnStartup: boolean;
}
declare const dbTypeSchema: z.ZodEnum<["sqlite", "postgresdb"]>;
type DbType = z.infer<typeof dbTypeSchema>;
export declare class DatabaseConfig {
    type: DbType;
    tablePrefix: string;
    pingIntervalSeconds: number;
    logging: LoggingConfig;
    postgresdb: PostgresConfig;
    sqlite: SqliteConfig;
}
export {};
