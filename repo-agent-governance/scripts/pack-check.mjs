import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const output = execFileSync('npm', ['pack', '--json', '--dry-run', '--ignore-scripts'], {
  encoding: 'utf8',
});
const packageInfo = JSON.parse(output)[0];
const files = new Set(packageInfo.files.map(entry => entry.path));
const managedAdapters = JSON.parse(
  readFileSync('repo-agent-governance/managed-assets.json', 'utf8'),
).assets.map(asset => asset.target);
const required = [
  'scripts/bootstrapAgentGovernance.mjs',
  'scripts/init.ts',
  'repo-agent-governance/manifest.json',
  'repo-agent-governance/managed-assets.json',
  'repo-agent-governance/scripts/governance.mjs',
  'repo-agent-governance/tools/contract-loop/core.mjs',
  'repo-agent-governance/tools/contract-loop/hook-runtime.mjs',
  'repo-agent-governance/adapters/cursor/hooks.json',
  'repo-agent-governance/adapters/cursor/contract-loop-gate.mjs',
  'repo-agent-governance/adapters/codex/hooks.json',
  'repo-agent-governance/adapters/codex/contract-loop-gate.mjs',
];
const forbidden = [
  '.cabloy-agent-governance-state.json',
  '.claude/scheduled_tasks.lock',
  '.claude/settings.local.json',
];
for (const path of required) {
  if (!files.has(path)) throw new Error(`npm package is missing governance asset: ${path}`);
}
// A pre-governance upgrader overwrites manifest-managed outputs before it invokes the
// incoming initializer. Keep every managed adapter out of this transition package so the
// initializer can adopt canonical outputs without destroying a customized legacy adapter.
for (const path of managedAdapters) {
  if (files.has(path)) {
    throw new Error(`npm package must exclude transition adapter output: ${path}`);
  }
}
for (const path of forbidden) {
  if (files.has(path))
    throw new Error(`npm package must not contain local governance state: ${path}`);
}
// eslint-disable-next-line no-console
console.log(
  `Governance package surface is valid (${required.length} canonical assets; ${managedAdapters.length} transition adapters excluded).`,
);
