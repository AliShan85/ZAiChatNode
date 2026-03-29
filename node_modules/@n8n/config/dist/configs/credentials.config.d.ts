import { CommaSeparatedStringArray } from '../custom-types';
declare class CredentialsOverwrite {
    data: string;
    endpoint: string;
    endpointAuthToken: string;
    persistence: boolean;
    skipTypes: CommaSeparatedStringArray<string>;
}
export declare class CredentialsConfig {
    defaultName: string;
    overwrite: CredentialsOverwrite;
}
export {};
