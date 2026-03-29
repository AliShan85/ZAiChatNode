import { Command } from '@oclif/core';
export default class Release extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        publish: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
