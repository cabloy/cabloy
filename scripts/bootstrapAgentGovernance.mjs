import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UPGRADE_SOURCE_DIR = resolve(ROOT_DIR, 'node_modules/.cabloy-upgrade');
const GOVERNANCE_SCRIPT_NAMES = [
  'test:spec-charts',
  'spec:charts',
  'spec:charts:check',
  'agent:governance:render',
  'agent:governance:check',
  'agent:governance:adopt',
  'agent:governance:pack-check',
  'test:agent-governance',
  'contract:gate',
];

function reconcileGovernancePackageJson(sourceRoot) {
  const sourcePackagePath = resolve(sourceRoot, 'package.json');
  if (!existsSync(sourcePackagePath)) return;
  const projectPackagePath = resolve(ROOT_DIR, 'package.json');
  const sourcePackage = JSON.parse(readFileSync(sourcePackagePath, 'utf-8'));
  const projectPackage = JSON.parse(readFileSync(projectPackagePath, 'utf-8'));
  let changed = false;
  for (const name of GOVERNANCE_SCRIPT_NAMES) {
    const command = sourcePackage.scripts?.[name];
    if (!command) {
      throw new Error(`Expected governance script in ${sourcePackagePath}: ${name}`);
    }
    if (projectPackage.scripts?.[name] === command) continue;
    projectPackage.scripts ??= {};
    projectPackage.scripts[name] = command;
    changed = true;
  }
  if (changed) {
    writeFileSync(projectPackagePath, `${JSON.stringify(projectPackage, null, 2)}\n`);
    // eslint-disable-next-line no-console
    console.log('[init] Reconciled agent-governance package scripts');
  }
}

function adoptAgentGovernance() {
  const executable = resolve(ROOT_DIR, 'repo-agent-governance/scripts/governance.mjs');
  if (!existsSync(executable)) return;
  try {
    execFileSync(process.execPath, [executable, 'adopt', '--apply'], {
      cwd: ROOT_DIR,
      env: {
        ...process.env,
        CABLOY_GOVERNANCE_ROOT: ROOT_DIR,
      },
      stdio: 'inherit',
    });
  } catch (error) {
    if (error.status !== 2) throw error;
    // eslint-disable-next-line no-console
    console.log(
      '[init] Agent-governance adoption preserved locally modified or legacy adapter outputs. Review the reported conflicts before explicitly forcing an individual managed target.',
    );
  }
}

export function bootstrapAgentGovernance() {
  const sourceDir = resolve(UPGRADE_SOURCE_DIR, 'repo-agent-governance');
  const targetDir = resolve(ROOT_DIR, 'repo-agent-governance');
  if (existsSync(sourceDir)) {
    // A pre-governance upgrader has already loaded its own upgrade.ts before it overwrites
    // scripts/. Replace the canonical source here, before the current initializer adopts
    // individual adapter outputs.
    rmSync(targetDir, { recursive: true, force: true });
    cpSync(sourceDir, targetDir, { recursive: true });
    reconcileGovernancePackageJson(UPGRADE_SOURCE_DIR);
  }
  // The npm package deliberately excludes generated adapter outputs for the migration
  // release. This also covers a fresh project, where no staged upgrade source exists.
  adoptAgentGovernance();
}

bootstrapAgentGovernance();
