import minimist from 'minimist';
import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Constants ---
const TAG_PREFIX = 'cabloy@';
const GITHUB_REPO = 'cabloy/cabloy';
const COMMIT_CAP = 200;
const RELEASE_SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT_DIR = resolve(dirname(RELEASE_SCRIPT_PATH), '..');
const VONA_DIR = resolve(ROOT_DIR, 'vona');
const VONA_PACKAGE_JSON_PATH = resolve(VONA_DIR, 'package.json');
const VONA_PACKAGE_ORIGINAL_JSON_PATH = resolve(VONA_DIR, 'package.original.json');
const VONA_WORKSPACE_PATH = resolve(VONA_DIR, 'pnpm-workspace.yaml');
const VONA_LOCKFILE_PATH = resolve(VONA_DIR, 'pnpm-lock.yaml');
const VONA_PATCHES_DIR = resolve(VONA_DIR, 'patches');
const VONA_ZOVA_REST_DIR = resolve(VONA_DIR, '.zova-rest');
const ZOVA_DIR = resolve(ROOT_DIR, 'zova');
const ZOVA_PACKAGE_JSON_PATH = resolve(ZOVA_DIR, 'package.json');
const ZOVA_PACKAGE_ORIGINAL_JSON_PATH = resolve(ZOVA_DIR, 'package.original.json');
const ZOVA_LOCKFILE_PATH = resolve(ZOVA_DIR, 'pnpm-lock.yaml');
const ZOVA_CORE_PACKAGE_JSON_PATH = resolve(
  ROOT_DIR,
  'zova',
  'packages-zova',
  'zova-core',
  'package.json',
);
const PACKAGE_JSON_PATH = resolve(ROOT_DIR, 'package.json');
const CHANGELOG_PATH = resolve(ROOT_DIR, 'CHANGELOG.md');
const ZOVA_CORE_PATCH_TARGETS = [
  'dist/bean/resource/error/errorGlobal.d.ts',
  'dist/types/utils/env.d.ts',
  'dist/types/interface/module.d.ts',
] as const;

interface ExecOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

interface FileSnapshot {
  filePath: string;
  content: string | null;
}

// --- Utility functions ---
function exec(cmd: string, dryRun?: boolean, options?: ExecOptions): string {
  if (dryRun) {
    // eslint-disable-next-line
    console.log(`  [dry-run] ${cmd}`);
    return '';
  }
  return execSync(cmd, {
    cwd: options?.cwd || ROOT_DIR,
    env: options?.env ? { ...process.env, ...options.env } : process.env,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}

function execInherited(cmd: string, dryRun?: boolean, options?: ExecOptions): void {
  if (dryRun) {
    // eslint-disable-next-line
    console.log(`  [dry-run] ${cmd}`);
    return;
  }
  execSync(cmd, {
    cwd: options?.cwd || ROOT_DIR,
    env: options?.env ? { ...process.env, ...options.env } : process.env,
    encoding: 'utf-8',
    stdio: 'inherit',
  });
}

function readJson(filePath: string): Record<string, any> {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function readPackageJson(): Record<string, any> {
  return readJson(PACKAGE_JSON_PATH);
}

function writePackageJson(pkg: Record<string, any>): void {
  writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
}

function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

function parseVersion(version: string): [number, number, number] {
  if (!isValidVersion(version)) {
    throw new Error(`Invalid version: ${version}`);
  }
  const [major, minor, patch] = version.split('.').map(item => Number.parseInt(item, 10));
  return [major, minor, patch];
}

function compareVersions(left: string, right: string): number {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let i = 0; i < leftParts.length; i++) {
    if (leftParts[i] > rightParts[i]) return 1;
    if (leftParts[i] < rightParts[i]) return -1;
  }
  return 0;
}

function getLastTag(): string | null {
  try {
    const result = execSync(`git tag -l '${TAG_PREFIX}*' --sort=-v:refname`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
    const tags = result.split('\n').filter(Boolean);
    return tags.length > 0 ? tags[0] : null;
  } catch {
    return null;
  }
}

interface CommitInfo {
  hash: string;
  subject: string;
}

function getCommitsSinceTag(tag: string | null): CommitInfo[] {
  const range = tag ? `${tag}..HEAD` : 'HEAD';
  const logCmd = `git log ${range} --pretty=format:"%h|||%s" --no-merges -${COMMIT_CAP}`;
  const result = execSync(logCmd, { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
  if (!result) return [];
  return result.split('\n').map(line => {
    const [hash, subject] = line.split('|||');
    return { hash: hash.trim(), subject: subject.trim() };
  });
}

function bumpVersion(current: string, bumpType: 'patch' | 'minor' | 'major'): string {
  const parts = current.split('.').map(Number);
  if (parts.length !== 3) throw new Error(`Invalid version: ${current}`);
  if (bumpType === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (bumpType === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join('.');
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getPatchFilePath(version: string): string {
  return resolve(VONA_PATCHES_DIR, `zova-core@${version}.patch`);
}

function readCurrentPatchedZovaCoreVersion(): string | null {
  const content = readFileSync(VONA_WORKSPACE_PATH, 'utf-8');
  const match = content.match(/^\s*zova-core@(\d+\.\d+\.\d+):\s+patches\/zova-core@\1\.patch\s*$/m);
  return match?.[1] || null;
}

function readLocalZovaCoreVersion(): string {
  const pkg = readJson(ZOVA_CORE_PACKAGE_JSON_PATH);
  const version = pkg.version?.trim();
  if (!version || !isValidVersion(version)) {
    throw new Error(`Invalid zova-core version in ${ZOVA_CORE_PACKAGE_JSON_PATH}`);
  }
  return version;
}

function updateVonaPatchedDependency(version?: string): void {
  const patchLine = version ? `  zova-core@${version}: patches/zova-core@${version}.patch` : null;
  const lines = readFileSync(VONA_WORKSPACE_PATH, 'utf-8').split('\n');
  const patchedDependenciesIndex = lines.findIndex(line => line.trim() === 'patchedDependencies:');
  if (patchedDependenciesIndex === -1) {
    throw new Error(`Missing patchedDependencies block in ${VONA_WORKSPACE_PATH}`);
  }
  let blockEndIndex = patchedDependenciesIndex + 1;
  while (blockEndIndex < lines.length) {
    const line = lines[blockEndIndex];
    if (line && !/^\s/.test(line)) break;
    blockEndIndex++;
  }
  const preservedBlockLines = lines
    .slice(patchedDependenciesIndex + 1, blockEndIndex)
    .filter(
      line =>
        !/^\s*zova-core@\d+\.\d+\.\d+:\s+patches\/zova-core@\d+\.\d+\.\d+\.patch\s*$/.test(line),
    );
  const newLines = [
    ...lines.slice(0, patchedDependenciesIndex + 1),
    ...(patchLine ? [patchLine] : []),
    ...preservedBlockLines,
    ...lines.slice(blockEndIndex),
  ];
  writeFileSync(VONA_WORKSPACE_PATH, `${newLines.join('\n').replace(/\n+$/, '\n')}\n`);
}

function readFileIfExists(filePath: string): string | null {
  return existsSync(filePath) ? readFileSync(filePath, 'utf-8') : null;
}

function restoreFileSnapshot(snapshot: FileSnapshot): void {
  if (snapshot.content === null) {
    rmSync(snapshot.filePath, { force: true });
    return;
  }
  writeFileSync(snapshot.filePath, snapshot.content);
}

function createFileSnapshot(filePath: string): FileSnapshot {
  return {
    filePath,
    content: readFileIfExists(filePath),
  };
}

function seedVonaZovaRestWorkspaceDependencies(): void {
  if (!existsSync(VONA_ZOVA_REST_DIR)) return;
  const pkg = readJson(VONA_PACKAGE_JSON_PATH) as {
    dependencies?: Record<string, string>;
  };
  pkg.dependencies ??= {};
  let changed = false;
  for (const entry of readdirSync(VONA_ZOVA_REST_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const depName = `zova-rest-${entry.name}`;
    const depValue = 'workspace:^';
    if (pkg.dependencies[depName] === depValue) continue;
    pkg.dependencies[depName] = depValue;
    changed = true;
  }
  if (!changed) return;
  writeFileSync(VONA_PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
}

function refreshZovaDependencyGraph(): void {
  copyFileSync(ZOVA_PACKAGE_ORIGINAL_JSON_PATH, ZOVA_PACKAGE_JSON_PATH);
  execInherited('pnpm install', false, { cwd: ZOVA_DIR });
  execInherited('npm run zova :tools:deps', false, { cwd: ZOVA_DIR });
  execInherited('npm run build:zova:admin');
  if (existsSync(resolve(ROOT_DIR, '__CABLOY_BASIC__'))) {
    execInherited('npm run build:zova:web');
  }
}

function prepareVonaBootstrapManifest(): void {
  copyFileSync(VONA_PACKAGE_ORIGINAL_JSON_PATH, VONA_PACKAGE_JSON_PATH);
  seedVonaZovaRestWorkspaceDependencies();
}

function refreshVonaDependencyGraph(): void {
  prepareVonaBootstrapManifest();
  execInherited('npm run deps:vona');
}

function validateGeneratedZovaCorePatch(version: string): void {
  const patchFilePath = getPatchFilePath(version);
  const patchContent = readFileIfExists(patchFilePath)?.trim();
  if (!patchContent) {
    throw new Error(`Generated zova-core patch is missing or empty: ${patchFilePath}`);
  }
  if (!patchContent.includes('diff --git')) {
    throw new Error(`Generated zova-core patch does not contain any diff hunks: ${patchFilePath}`);
  }
  for (const patchTarget of ZOVA_CORE_PATCH_TARGETS) {
    if (!patchContent.includes(`a/${patchTarget}`) || !patchContent.includes(`b/${patchTarget}`)) {
      throw new Error(`Generated zova-core patch is missing the expected target: ${patchTarget}`);
    }
  }
  if (!patchContent.includes(' export {};')) {
    throw new Error('Generated zova-core patch is missing the expected errorGlobal export rewrite');
  }
  if (!patchContent.includes("-declare module '@cabloy/module-info'")) {
    throw new Error(
      'Generated zova-core patch is missing the expected @cabloy/module-info removal',
    );
  }
  if (
    !patchContent.includes('-declare global {') ||
    !patchContent.includes('-        interface ProcessEnv {')
  ) {
    throw new Error('Generated zova-core patch is missing the expected ProcessEnv removal');
  }
}

function ensurePatchedLockfileVersion(version: string): void {
  const lockfileContent = readFileIfExists(VONA_LOCKFILE_PATH);
  if (!lockfileContent?.includes(`zova-core@${version}:`)) {
    throw new Error(`Vona lockfile is missing the patched zova-core@${version} entry`);
  }
}

function replaceOrThrow(
  content: string,
  search: RegExp,
  replacement: string,
  description: string,
): string {
  const matches = content.match(search);
  if (!matches || matches.length !== 1) {
    throw new Error(
      `Unable to locate ${description} exactly once while regenerating the zova-core patch`,
    );
  }
  return content.replace(search, replacement);
}

function applyKnownZovaCorePatchEdits(editDir: string): void {
  const errorGlobalPath = resolve(editDir, 'dist', 'bean', 'resource', 'error', 'errorGlobal.d.ts');
  const envPath = resolve(editDir, 'dist', 'types', 'utils', 'env.d.ts');
  const modulePath = resolve(editDir, 'dist', 'types', 'interface', 'module.d.ts');

  for (const filePath of [errorGlobalPath, envPath, modulePath]) {
    if (!existsSync(filePath)) {
      throw new Error(`Expected patch target file is missing: ${filePath}`);
    }
  }

  const errorGlobalContent = readFileSync(errorGlobalPath, 'utf-8');
  if (!errorGlobalContent.includes('declare global')) {
    throw new Error(`Expected global Error augmentation in ${errorGlobalPath}`);
  }
  writeFileSync(errorGlobalPath, 'export {};\n');

  const envContent = readFileSync(envPath, 'utf-8');
  const envNext = replaceOrThrow(
    envContent,
    /declare global \{\n {4}namespace NodeJS \{\n {8}interface ProcessEnv \{[\s\S]*?\n {8}\}\n {4}\}\n\}\n?/,
    '',
    'the NodeJS.ProcessEnv augmentation',
  );
  writeFileSync(envPath, envNext);

  const moduleContent = readFileSync(modulePath, 'utf-8');
  const moduleNext = replaceOrThrow(
    moduleContent,
    /declare module '@cabloy\/module-info' \{\n {4}interface IModule \{[\s\S]*?\n {4}\}\n\}\n?/,
    '',
    'the @cabloy/module-info augmentation',
  );
  writeFileSync(modulePath, moduleNext);
}

// --- Pre-step: Commit pending changes ---
function commitPendingChanges(dryRun?: boolean): void {
  const status = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
  if (!status) return;
  // eslint-disable-next-line
  console.log('\n📁 Committing pending changes...');
  exec('git add .', dryRun);
  exec('git commit -m "chore: pre-release commit"', dryRun);
  exec('git push', dryRun);
}

// --- Pre-step: Sub-project release ---
function subProjectRelease(bumpType: 'patch' | 'minor' | 'major', dryRun?: boolean): void {
  // eslint-disable-next-line
  console.log(`\n🔧 Running vona/zova release (${bumpType})...`);
  execInherited(`lerna publish ${bumpType} --yes`, dryRun);
}

// --- Compensation step: Refresh the zova-core patch ---
function regenerateVonaZovaCorePatch(
  currentPatchedVersion: string,
  targetVersion: string,
  dryRun?: boolean,
): void {
  const editDir = resolve(
    VONA_DIR,
    'node_modules',
    '.release-compensation',
    `zova-core-${targetVersion}`,
  );
  const oldPatchFilePath = getPatchFilePath(currentPatchedVersion);
  const newPatchFilePath = getPatchFilePath(targetVersion);

  // eslint-disable-next-line
  console.log(`\n🩹 Regenerating the Vona zova-core patch for ${targetVersion}...`);

  if (dryRun) {
    // eslint-disable-next-line
    console.log('  [dry-run] Refresh the Zova dependency graph from package.original.json');
    // eslint-disable-next-line
    console.log('  [dry-run] Run pnpm install in zova');
    // eslint-disable-next-line
    console.log('  [dry-run] Run npm run zova :tools:deps in zova');
    // eslint-disable-next-line
    console.log('  [dry-run] Run npm run build:zova:admin');
    // eslint-disable-next-line
    console.log('  [dry-run] Run npm run build:zova:web when the active edition requires it');
    // eslint-disable-next-line
    console.log('  [dry-run] Refresh the Vona dependency graph from package.original.json');
    // eslint-disable-next-line
    console.log(
      '  [dry-run] Temporarily remove the current zova-core patched dependency registration',
    );
    // eslint-disable-next-line
    console.log('  [dry-run] Seed Vona .zova-rest workspace dependencies if needed');
    // eslint-disable-next-line
    console.log('  [dry-run] Run npm run deps:vona');
    // eslint-disable-next-line
    console.log('  [dry-run] Run pnpm install in vona without the old patch registration');
    execInherited('pnpm install', true, { cwd: VONA_DIR });
    execInherited(
      `pnpm patch zova-core@${targetVersion} --edit-dir "${editDir}" --ignore-existing`,
      true,
      { cwd: VONA_DIR },
    );
    // eslint-disable-next-line
    console.log('  [dry-run] Apply the known zova-core declaration-file patch edits');
    execInherited(`pnpm patch-commit "${editDir}" --patches-dir patches`, true, {
      cwd: VONA_DIR,
    });
    // eslint-disable-next-line
    console.log(`  [dry-run] Validate ${newPatchFilePath}`);
    // eslint-disable-next-line
    console.log(`  [dry-run] Restore ${VONA_WORKSPACE_PATH} to point at ${newPatchFilePath}`);
    // eslint-disable-next-line
    console.log(`  [dry-run] Remove ${oldPatchFilePath} if it still exists`);
    execInherited('pnpm install', true, { cwd: VONA_DIR });
    return;
  }

  const snapshots = [
    createFileSnapshot(ZOVA_PACKAGE_JSON_PATH),
    createFileSnapshot(ZOVA_LOCKFILE_PATH),
    createFileSnapshot(VONA_PACKAGE_JSON_PATH),
    createFileSnapshot(VONA_WORKSPACE_PATH),
    createFileSnapshot(VONA_LOCKFILE_PATH),
    createFileSnapshot(oldPatchFilePath),
    createFileSnapshot(newPatchFilePath),
  ];

  rmSync(editDir, { recursive: true, force: true });
  mkdirSync(dirname(editDir), { recursive: true });

  try {
    refreshZovaDependencyGraph();
    updateVonaPatchedDependency();
    refreshVonaDependencyGraph();
    execInherited('pnpm install', false, { cwd: VONA_DIR });

    execInherited(
      `pnpm patch zova-core@${targetVersion} --edit-dir "${editDir}" --ignore-existing`,
      false,
      {
        cwd: VONA_DIR,
      },
    );
    applyKnownZovaCorePatchEdits(editDir);
    execInherited(`pnpm patch-commit "${editDir}" --patches-dir patches`, false, {
      cwd: VONA_DIR,
    });
    validateGeneratedZovaCorePatch(targetVersion);

    updateVonaPatchedDependency(targetVersion);
    if (currentPatchedVersion !== targetVersion && existsSync(oldPatchFilePath)) {
      rmSync(oldPatchFilePath);
    }
    execInherited('pnpm install', false, { cwd: VONA_DIR });
    if (readCurrentPatchedZovaCoreVersion() !== targetVersion) {
      throw new Error(
        `Vona patchedDependencies entry was not updated to zova-core@${targetVersion}`,
      );
    }
    ensurePatchedLockfileVersion(targetVersion);
  } catch (error) {
    for (const snapshot of snapshots) {
      restoreFileSnapshot(snapshot);
    }
    try {
      execInherited('pnpm install', false, { cwd: VONA_DIR });
    } catch {
      // eslint-disable-next-line
      console.warn(
        'Warning: failed to restore the Vona install state after compensation rollback.',
      );
    }
    throw error;
  } finally {
    rmSync(editDir, { recursive: true, force: true });
  }
}

function refreshVonaLockfile(dryRun?: boolean): void {
  // eslint-disable-next-line
  console.log('\n📦 Refreshing the Vona lockfile...');
  execInherited(`pnpm --dir "${VONA_DIR}" install`, dryRun);
}

function verifyCompensationPatch(dryRun?: boolean): void {
  // eslint-disable-next-line
  console.log('\n✅ Verifying the refreshed zova-core patch...');
  execInherited('pnpm exec tsc -p tsconfig.json --noEmit', dryRun, { cwd: VONA_DIR });
  execInherited('npm run tsc', dryRun);
}

function commitCompensationChanges(targetVersion: string, dryRun?: boolean): void {
  // eslint-disable-next-line
  console.log('\n📁 Committing compensation changes...');
  const stageTargets = ['vona/pnpm-workspace.yaml', 'vona/pnpm-lock.yaml', 'vona/patches'];
  if (existsSync(VONA_PACKAGE_JSON_PATH)) {
    let trackedPackageJson = false;
    try {
      trackedPackageJson =
        execSync(`git ls-files --error-unmatch "${VONA_PACKAGE_JSON_PATH}"`, {
          cwd: ROOT_DIR,
          stdio: 'pipe',
        })
          .toString()
          .trim() !== '';
    } catch {
      trackedPackageJson = false;
    }
    if (trackedPackageJson) {
      stageTargets.unshift('vona/package.json');
    }
  }
  exec(`git add ${stageTargets.join(' ')}`, dryRun);
  if (!dryRun) {
    const staged = execSync(`git diff --cached --name-only -- ${stageTargets.join(' ')}`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
    if (!staged) {
      throw new Error('No compensation changes were staged for commit');
    }
  }
  exec(`git commit -m "chore: refresh vona zova-core patch for v${targetVersion}"`, dryRun);
  exec('git push', dryRun);
}

function rerunPatchReleaseAfterCompensation(noAi?: boolean, dryRun?: boolean): void {
  const noAiFlag = noAi ? ' --no-ai' : '';
  // eslint-disable-next-line
  console.log('\n🚀 Running the compensation patch release...');
  execInherited(`node "${RELEASE_SCRIPT_PATH}" patch --skip-compensation${noAiFlag}`, dryRun);
}

async function postReleaseCompensation(options: ReleaseOptions): Promise<void> {
  if (
    options.dryRun ||
    options.changelogOnly ||
    options.publishOnly ||
    options.releaseOnly ||
    options.skipCompensation
  ) {
    return;
  }

  // eslint-disable-next-line
  console.log('\n🔍 Checking whether zova-core compensation is needed...');

  const currentPatchedVersion = readCurrentPatchedZovaCoreVersion();
  if (!currentPatchedVersion) {
    throw new Error(`Missing zova-core patchedDependencies entry in ${VONA_WORKSPACE_PATH}`);
  }

  const localZovaCoreVersion = readLocalZovaCoreVersion();
  // eslint-disable-next-line
  console.log(`Current Vona zova-core patch target: ${currentPatchedVersion}`);
  // eslint-disable-next-line
  console.log(`Local zova-core version: ${localZovaCoreVersion}`);

  if (compareVersions(localZovaCoreVersion, currentPatchedVersion) <= 0) {
    // eslint-disable-next-line
    console.log('zova-core patch already matches the local version. Skipping compensation.');
    return;
  }

  regenerateVonaZovaCorePatch(currentPatchedVersion, localZovaCoreVersion, options.dryRun);
  refreshVonaLockfile(options.dryRun);
  verifyCompensationPatch(options.dryRun);
  commitCompensationChanges(localZovaCoreVersion, options.dryRun);
  rerunPatchReleaseAfterCompensation(options.noAi, options.dryRun);
}

// --- Step 1: Version Bump ---
async function versionBump(
  bumpType: 'patch' | 'minor' | 'major',
  dryRun?: boolean,
): Promise<string> {
  const pkg = readPackageJson();
  const currentVersion = pkg.version;
  const lastTag = getLastTag();

  // Check for changes since last tag
  if (lastTag) {
    const diffCmd = `git -c diff.renameLimit=10000 diff --name-only ${lastTag}..HEAD`;
    const changedFiles = execSync(diffCmd, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (!changedFiles) {
      // eslint-disable-next-line
      console.log('No changes since last release. Skipping version bump.');
      return currentVersion;
    }
  }

  const newVersion = bumpVersion(currentVersion, bumpType);
  // eslint-disable-next-line
  console.log(`\n📦 Version bump: ${currentVersion} → ${newVersion}`);

  pkg.version = newVersion;
  if (!dryRun) {
    writePackageJson(pkg);
  }

  const tag = `${TAG_PREFIX}${newVersion}`;
  exec('git add package.json', dryRun);
  exec(`git commit -m "chore: release v${newVersion}"`, dryRun);
  exec(`git tag ${tag}`, dryRun);
  exec('git push', dryRun);
  exec(`git push origin ${tag}`, dryRun);

  return newVersion;
}

// --- Step 2: AI Changelog ---
async function callAnthropic(commits: CommitInfo[], version: string): Promise<string> {
  const token = process.env.ANTHROPIC_AUTH_TOKEN;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

  if (!token) throw new Error('ANTHROPIC_AUTH_TOKEN environment variable is not set');

  const commitList = commits.map(c => `- ${c.subject}`).join('\n');

  const prompt = `You are a changelog generator. Given the following git commit messages since the last release, generate a concise, well-organized changelog in markdown format for version ${version}.

Group changes into these categories (only include categories that have entries):
- **Features**: New features or capabilities
- **Bug Fixes**: Bug fixes and corrections
- **Improvements**: Performance improvements, refactoring, DX improvements
- **Breaking Changes**: Any breaking changes

For each entry, write a clear description in imperative mood. Do not include commit hashes.

Commits:
${commitList}

Respond with ONLY the changelog content in markdown, starting with ## ${version}`;

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': token,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
    error?: { message: string };
  };
  if (data.error) {
    throw new Error(`Anthropic API error: ${data.error.message}`);
  }
  const textBlock = data.content?.find(c => c.type === 'text');
  const text = textBlock?.text;
  if (!text) {
    throw new Error(`Unexpected Anthropic API response: ${JSON.stringify(data)}`);
  }
  return text;
}

async function generateChangelog(version: string, dryRun?: boolean, noAi?: boolean): Promise<void> {
  // eslint-disable-next-line
  console.log(`\n📝 Generating changelog for v${version}...`);

  // Use the tag for the current version to find the previous tag
  // After version bump, the current tag (e.g. cabloy@5.1.4) points to HEAD,
  // so we need the tag BEFORE that to get the commit range
  const currentTag = `${TAG_PREFIX}${version}`;
  const allTags = execSync(`git tag -l '${TAG_PREFIX}*' --sort=-v:refname`, {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
  })
    .trim()
    .split('\n')
    .filter(Boolean);
  const currentTagIndex = allTags.indexOf(currentTag);
  const previousTag =
    currentTagIndex >= 0 && currentTagIndex < allTags.length - 1
      ? allTags[currentTagIndex + 1]
      : null;
  const commits = getCommitsSinceTag(previousTag);

  if (commits.length === 0) {
    // eslint-disable-next-line
    console.log('No commits found. Skipping changelog generation.');
    return;
  }

  let newSection: string;

  if (noAi || dryRun) {
    const commitList = commits.map(c => `- ${c.subject}`).join('\n');
    newSection = `## ${version} (${getToday()})\n\n${commitList}`;
  } else {
    newSection = await callAnthropic(commits, version);
    // Ensure the section starts with the version header if AI didn't include it
    if (!newSection.startsWith(`## ${version}`)) {
      newSection = `## ${version} (${getToday()})\n\n${newSection}`;
    }
  }

  // Read existing changelog or create new one
  let existingContent = '';
  if (existsSync(CHANGELOG_PATH)) {
    existingContent = readFileSync(CHANGELOG_PATH, 'utf-8');
  }

  // Prepend new section
  const header = '# Changelog\n\n';
  let changelog: string;
  if (existingContent.startsWith('# Changelog')) {
    changelog = existingContent.replace('# Changelog\n\n', `${header + newSection}\n\n`);
  } else {
    changelog = `${header + newSection}\n\n${existingContent}`;
  }

  if (dryRun) {
    // eslint-disable-next-line
    console.log(`  [dry-run] Write to CHANGELOG.md:\n${newSection}\n`);
  } else {
    writeFileSync(CHANGELOG_PATH, changelog);
  }

  exec('git add CHANGELOG.md', dryRun);
  exec(`git commit -m "chore: update CHANGELOG.md for v${version}"`, dryRun);
  exec('git push', dryRun);
}

// --- Step 3: npm Publish ---
async function npmPublish(dryRun?: boolean): Promise<void> {
  // eslint-disable-next-line
  console.log('\n🚀 Publishing to npm...');

  if (dryRun) {
    // eslint-disable-next-line
    console.log('  [dry-run] npm publish');
    return;
  }

  execSync('npm publish', { cwd: ROOT_DIR, encoding: 'utf-8', stdio: 'inherit' });
}

// --- Step 4: GitHub Release ---
async function githubRelease(version: string, dryRun?: boolean): Promise<void> {
  // eslint-disable-next-line
  console.log(`\n🏷️  Creating GitHub release for v${version}...`);

  // Extract changelog section for this version
  let notes = '';
  if (existsSync(CHANGELOG_PATH)) {
    const content = readFileSync(CHANGELOG_PATH, 'utf-8');
    const versionHeader = `## ${version}`;
    const startIdx = content.indexOf(versionHeader);
    if (startIdx !== -1) {
      const nextSectionIdx = content.indexOf('\n## ', startIdx + versionHeader.length);
      notes =
        nextSectionIdx !== -1
          ? content.substring(startIdx, nextSectionIdx).trim()
          : content.substring(startIdx).trim();
    }
  }

  const tag = `${TAG_PREFIX}${version}`;

  if (dryRun) {
    // eslint-disable-next-line
    console.log(
      `  [dry-run] gh release create ${tag} --repo ${GITHUB_REPO} --title "v${version}" --notes-file <changelog-section>`,
    );
    return;
  }

  // Use gh CLI with a temp file for notes to avoid shell escaping issues
  const tmpFile = resolve(ROOT_DIR, '.release-notes.tmp.md');
  writeFileSync(tmpFile, notes);
  try {
    execSync(
      `gh release create ${tag} --repo ${GITHUB_REPO} --title "v${version}" --notes-file "${tmpFile}"`,
      {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'inherit',
      },
    );
  } finally {
    if (existsSync(tmpFile)) {
      execSync(`rm -f "${tmpFile}"`, { cwd: ROOT_DIR });
    }
  }
}

// --- Main ---
interface ReleaseOptions {
  bumpType: 'patch' | 'minor' | 'major';
  dryRun?: boolean;
  changelogOnly?: boolean;
  publishOnly?: boolean;
  releaseOnly?: boolean;
  skipChangelog?: boolean;
  skipPublish?: boolean;
  skipRelease?: boolean;
  skipCompensation?: boolean;
  noAi?: boolean;
}

async function release(options: ReleaseOptions): Promise<void> {
  // eslint-disable-next-line
  console.log('🔧 Cabloy Release\n');

  // Pre-flight checks
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: 'pipe',
    });
  } catch {
    // eslint-disable-next-line
    console.error('Error: Not in a git repository');
    process.exit(1);
  }

  const status = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
  if (status && !options.dryRun) {
    // eslint-disable-next-line
    console.error('Error: Working tree is not clean. Commit or stash your changes first.');
    process.exit(1);
  }

  // Determine the version to use
  let version: string;

  if (options.changelogOnly || options.publishOnly || options.releaseOnly) {
    const pkg = readPackageJson();
    version = pkg.version;
    // eslint-disable-next-line
    console.log(`Using current version: ${version}`);
  } else {
    // Pre-steps: commit pending, release sub-projects, then commit again
    commitPendingChanges(options.dryRun);
    subProjectRelease(options.bumpType, options.dryRun);
    commitPendingChanges(options.dryRun);

    version = await versionBump(options.bumpType, options.dryRun);
  }

  // Changelog
  if (!options.skipChangelog && !options.publishOnly && !options.releaseOnly) {
    await generateChangelog(version, options.dryRun, options.noAi);
  }

  // npm publish
  if (!options.skipPublish && !options.changelogOnly && !options.releaseOnly) {
    await npmPublish(options.dryRun);
  }

  // GitHub release
  if (!options.skipRelease && !options.changelogOnly && !options.publishOnly) {
    await githubRelease(version, options.dryRun);
  }

  await postReleaseCompensation(options);

  // eslint-disable-next-line
  console.log('\n✅ Release complete!');
}

// --- Entry point ---
const args = minimist(process.argv.slice(2), {
  boolean: [
    'dry-run',
    'changelog-only',
    'publish-only',
    'release-only',
    'skip-changelog',
    'skip-publish',
    'skip-release',
    'skip-compensation',
    'no-ai',
  ],
  default: {
    'dry-run': false,
    'changelog-only': false,
    'publish-only': false,
    'release-only': false,
    'skip-changelog': false,
    'skip-publish': false,
    'skip-release': false,
    'skip-compensation': false,
    'no-ai': false,
  },
});

const bumpType = (args._[0] || 'patch') as 'patch' | 'minor' | 'major';
if (!['patch', 'minor', 'major'].includes(bumpType)) {
  // eslint-disable-next-line
  console.error(`Invalid bump type: ${bumpType}. Use patch, minor, or major.`);
  process.exit(1);
}

release({
  bumpType,
  dryRun: args['dry-run'],
  changelogOnly: args['changelog-only'],
  publishOnly: args['publish-only'],
  releaseOnly: args['release-only'],
  skipChangelog: args['skip-changelog'],
  skipPublish: args['skip-publish'],
  skipRelease: args['skip-release'],
  skipCompensation: args['skip-compensation'],
  noAi: args['no-ai'],
}).catch(err => {
  // eslint-disable-next-line
  console.error(`\n❌ Release failed: ${err.message}`);
  process.exit(1);
});
