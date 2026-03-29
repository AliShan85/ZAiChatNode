"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@clack/prompts");
const core_1 = require("@oclif/core");
const child_process_1 = require("../utils/child-process");
const package_manager_1 = require("../utils/package-manager");
const prompts_2 = require("../utils/prompts");
class Release extends core_1.Command {
    async run() {
        const { flags } = await this.parse(Release);
        (0, prompts_1.intro)(await (0, prompts_2.getCommandHeader)('n8n-node release'));
        const pm = (await (0, package_manager_1.detectPackageManager)()) ?? 'npm';
        const isCI = Boolean(process.env.GITHUB_ACTIONS);
        try {
            if (isCI) {
                await (0, child_process_1.runCommand)(pm, ['run', 'lint'], { stdio: 'inherit' });
                await (0, child_process_1.runCommand)(pm, ['run', 'build'], { stdio: 'inherit' });
                await (0, child_process_1.runCommand)('npm', ['publish'], {
                    stdio: 'inherit',
                    env: {
                        RELEASE_MODE: 'true',
                        NPM_CONFIG_PROVENANCE: 'true',
                    },
                });
                return;
            }
            if (flags.publish) {
                prompts_1.log.warning('Publishing directly from your machine will not include npm provenance, which is required for n8n Cloud starting May 1 2026.\nConsider switching to GitHub Actions publishing. See: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/');
            }
            await (0, child_process_1.runCommand)('release-it', [
                '-n',
                '--git.requireBranch main',
                '--git.requireCleanWorkingDir',
                '--git.requireUpstream',
                '--git.requireCommits',
                '--git.commit',
                '--git.tag',
                '--git.push',
                '--git.changelog="npx auto-changelog --stdout --unreleased --commit-limit false -u --hide-credit"',
                '--github.release',
                `--hooks.before:init="${pm} run lint && ${pm} run build"`,
                '--hooks.after:bump="npx auto-changelog -p"',
                ...(flags.publish ? [] : ['--npm.publish=false']),
            ], {
                stdio: 'inherit',
                context: 'local',
                env: {
                    RELEASE_MODE: 'true',
                },
            });
            if (!flags.publish) {
                prompts_1.log.info('The node was not published to NPM. Starting May 1 2026, n8n requires verified community nodes to be published via GitHub Actions with npm provenance. Learn more in our documentation: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/');
            }
        }
        catch (error) {
            if (error instanceof child_process_1.ChildProcessError) {
                if (error.signal) {
                    process.kill(process.pid, error.signal);
                }
                else {
                    process.exit(error.code ?? 0);
                }
            }
            throw error;
        }
    }
}
Release.description = `Release your community node package.

When running locally (default): Runs release-it to bump the version interactively, generate a changelog, commit, tag, push, and create a GitHub release. Does NOT publish to npm — use GitHub Actions for that.

When running inside a GitHub Action: Detected automatically via the GITHUB_ACTIONS environment variable. Runs lint and build, then publishes with provenance enabled (NPM_CONFIG_PROVENANCE=true).

Starting May 1 2026, n8n requires all community nodes to be published via GitHub Actions with npm provenance. Provenance lets anyone cryptographically verify that a package was built from a specific repository and commit.

To set up GitHub Actions publishing:
  1. Add a publish.yml workflow that triggers on version tags (e.g. v*.*.*).
  2. Grant the publish job: permissions: { id-token: write, contents: read }
  3. Use actions/setup-node with registry-url: 'https://registry.npmjs.org/'
  4. Run \`npm run release\` as the publish step.

For npm Trusted Publishing (no long-lived secrets):
  On npmjs.com → package settings → Trusted Publishers → add your repo and workflow name.
  Leave NPM_TOKEN unset; GitHub's OIDC token is used automatically.

For token-based auth (fallback):
  Add NPM_TOKEN to your repository secrets and pass it as NODE_AUTH_TOKEN.

Full documentation: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/`;
Release.examples = ['<%= config.bin %> <%= command.id %>'];
Release.flags = {
    publish: core_1.Flags.boolean({
        description: 'Publish to npm from your local machine (not recommended). Packages published this way will not include npm provenance and cannot become verified community nodes.',
        default: false,
    }),
};
exports.default = Release;
//# sourceMappingURL=release.js.map