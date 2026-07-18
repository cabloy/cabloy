import { execSync } from 'node:child_process';
import {
  cpSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { x as extractTar } from 'tar';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const NPM_REGISTRY = 'https://registry.npmjs.org';
const PACKAGE_NAME = 'cabloy';
const TEMP_DIR = resolve(ROOT_DIR, 'node_modules/.cabloy-upgrade');
const VERSION_MARKER_FILE = '.cabloy-version';

// --- Whitelist ---

const OVERWRITE_DIRS: string[] = [
  // root
  'scripts',
  '.husky',
  'cabloy-docs',
  // vona
  'vona/packages-vona',
  'vona/packages-cli',
  'vona/packages-utils',
  'vona/src/suite-vendor',
  'vona/src/module-vendor',
  'vona/scripts',
  'vona/docker-compose-original',
  'vona/patches',
  // zova
  'zova/packages-zova',
  'zova/packages-cli',
  'zova/packages-utils',
  'zova/src/suite-vendor',
  'zova/src/module-vendor',
  'zova/src-ssr',
  'zova/scripts',
];

const OVERWRITE_DIRS_CABLOY_BASIC: string[] = [
  'vona/src/suite/cabloy-basic',
  'vona/src/suite/a-training',
  'zova/src/suite/cabloy-basic',
  'zova/src/suite/a-training',
  'zova/src/suite/a-devui',
];

const FRAMEWORK_E2E_DIRS_CABLOY_BASIC: string[] = [
  'e2e/config',
  'e2e/scripts',
  'e2e/specs/a-basic',
  'e2e/specs/a-commerce',
];

const FRAMEWORK_E2E_SCRIPT_NAMES_CABLOY_BASIC: string[] = [
  'test:e2e:basic',
  'test:e2e:basic:web',
  'test:e2e:basic:admin',
  'test:e2e:basic:dev',
  'test:e2e:commerce',
  'test:e2e:commerce:web',
  'test:e2e:commerce:admin',
  'test:e2e:commerce:dev',
];

const FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC = '@playwright/test';

const MERGE_DIRS: string[] = [
  // Claude project assets
  '.claude/commands',
  '.claude/hooks',
  '.claude/skills',
  // Vona Claude project assets
  'vona/.claude/commands',
  'vona/.claude/skills',
  // Zova Claude project assets
  'zova/.claude/commands',
  'zova/.claude/skills',
];

const BLACKLIST_DIRS: string[] = [
  // vona
  'vona/src/suite-vendor/a-test',
];

const WHITELIST_FILES: string[] = [
  // root
  'CLAUDE.md',
  '.claude/settings.json',
  'tsconfig.json',
  'tsconfig.base.json',
  'tsconfig.base.esm.json',
  'oxfmt.config.ts',
  'oxlint.config.ts',
  'lint-staged.config.mjs',
  // vona
  'vona/pnpm-workspace.yaml',
  'vona/tsconfig.json',
  'vona/tsconfig.base.json',
  'vona/tsconfig.base.esm.json',
  'vona/oxfmt.config.ts',
  'vona/oxlint.config.ts',
  'vona/codecov.yml',
  // zova
  'zova/pnpm-workspace.yaml',
  'zova/tsconfig.json',
  'zova/tsconfig.base.json',
  'zova/tsconfig.base.esm.json',
  'zova/tsconfig.rest.json',
  'zova/tsconfig.vue-tsc.json',
  'zova/oxfmt.config.ts',
  'zova/oxlint.config.ts',
  'zova/index.html',
  'zova/openapi.config.ts',
];

type LatestPackageInfo = {
  version: string;
  tarballUrl: string;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

// --- Helpers ---

// oxlint-disable no-console
const log = console.log; // eslint-disable-line no-console

function exec(cmd: string, env?: NodeJS.ProcessEnv): void {
  execSync(cmd, {
    stdio: 'inherit',
    cwd: ROOT_DIR,
    env: env ? { ...process.env, ...env } : process.env,
  });
}

function shouldCopyPath(path: string): boolean {
  return !path.includes('.DS_Store');
}

function copyDirectory(src: string, dest: string): void {
  cpSync(src, dest, { recursive: true, filter: shouldCopyPath });
}

function isCabloyBasic(): boolean {
  return existsSync(resolve(ROOT_DIR, '__CABLOY_BASIC__'));
}

function readPackageJson(filePath: string): PackageJson {
  return JSON.parse(readFileSync(filePath, 'utf-8')) as PackageJson;
}

function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

function parseVersion(version: string): [number, number, number] {
  if (!isValidVersion(version)) {
    throw new Error(`Invalid Cabloy version: ${version}`);
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

function readVersionMarker(): string | undefined {
  const filePath = resolve(ROOT_DIR, VERSION_MARKER_FILE);
  if (!existsSync(filePath)) return undefined;
  const version = readFileSync(filePath, 'utf-8').trim();
  if (!version) {
    throw new Error(`Invalid Cabloy version marker in ${VERSION_MARKER_FILE}: <empty>`);
  }
  if (!isValidVersion(version)) {
    throw new Error(`Invalid Cabloy version marker in ${VERSION_MARKER_FILE}: ${version}`);
  }
  return version;
}

function readRequiredVersionMarker(expectedVersion: string): string {
  const version = readVersionMarker();
  if (!version) {
    throw new Error(`Expected ${VERSION_MARKER_FILE} to be created after upgrade`);
  }
  if (version !== expectedVersion) {
    throw new Error(
      `Expected ${VERSION_MARKER_FILE} to be ${expectedVersion} after upgrade, received ${version}`,
    );
  }
  return version;
}

async function extractTarball(tarballPath: string, targetDir: string): Promise<void> {
  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });
  try {
    await extractTar({ file: tarballPath, cwd: targetDir, strip: 1 });
  } catch {
    throw new Error('Failed to extract tarball');
  }
}

function needsBasicE2eReconciliation(): boolean {
  if (!isCabloyBasic()) return false;

  for (const dir of FRAMEWORK_E2E_DIRS_CABLOY_BASIC) {
    if (!existsSync(resolve(ROOT_DIR, dir))) return true;
  }

  const packageJson = readPackageJson(resolve(ROOT_DIR, 'package.json'));
  for (const name of FRAMEWORK_E2E_SCRIPT_NAMES_CABLOY_BASIC) {
    const script = packageJson.scripts?.[name];
    if (!script?.includes('e2e/')) return true;
  }
  return !packageJson.devDependencies?.[FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC];
}

function mergeFrameworkE2eAssets(dryRun?: boolean): void {
  if (!isCabloyBasic()) return;

  for (const dir of FRAMEWORK_E2E_DIRS_CABLOY_BASIC) {
    const src = resolve(TEMP_DIR, dir);
    const dest = resolve(ROOT_DIR, dir);
    if (!existsSync(src)) {
      throw new Error(`Expected framework E2E directory in package: ${dir}`);
    }
    if (dryRun) {
      log(`  [dry-run] Merge framework E2E directory: ${dir}`);
      continue;
    }
    copyDirectory(src, dest);
  }
}

function reconcileFrameworkE2ePackageJson(dryRun?: boolean): void {
  if (!isCabloyBasic()) return;

  const projectPackagePath = resolve(ROOT_DIR, 'package.json');
  const sourcePackagePath = resolve(TEMP_DIR, 'package.json');
  const projectPackage = readPackageJson(projectPackagePath);
  const sourcePackage = readPackageJson(sourcePackagePath);
  const sourcePlaywrightVersion =
    sourcePackage.devDependencies?.[FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC];
  if (!sourcePlaywrightVersion) {
    throw new Error(
      `Expected ${FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC} in framework package devDependencies`,
    );
  }

  let changed = false;
  for (const name of FRAMEWORK_E2E_SCRIPT_NAMES_CABLOY_BASIC) {
    const sourceValue = sourcePackage.scripts?.[name];
    if (!sourceValue) {
      throw new Error(`Expected framework E2E script in package.json: ${name}`);
    }
    if (projectPackage.scripts?.[name] === sourceValue) continue;
    changed = true;
    if (dryRun) {
      log(`  [dry-run] Set package.json scripts.${name}`);
    } else {
      projectPackage.scripts ??= {};
      projectPackage.scripts[name] = sourceValue;
    }
  }

  if (
    projectPackage.devDependencies?.[FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC] !==
    sourcePlaywrightVersion
  ) {
    changed = true;
    if (dryRun) {
      log(
        `  [dry-run] Set package.json devDependencies.${FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC} = ${sourcePlaywrightVersion}`,
      );
    } else {
      projectPackage.devDependencies ??= {};
      projectPackage.devDependencies[FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC] =
        sourcePlaywrightVersion;
    }
  }

  if (projectPackage.dependencies?.[FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC]) {
    changed = true;
    if (dryRun) {
      log(
        `  [dry-run] Remove package.json dependencies.${FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC}`,
      );
    } else {
      delete projectPackage.dependencies[FRAMEWORK_E2E_DEV_DEPENDENCY_CABLOY_BASIC];
    }
  }

  if (!changed) {
    if (dryRun) log('  [dry-run] Framework E2E package entries already match');
    return;
  }
  if (!dryRun) {
    writeFileSync(projectPackagePath, `${JSON.stringify(projectPackage, null, 2)}\n`);
  }
}

// --- Step 1: Pre-flight ---

function preflight(): void {
  const markers = ['__CABLOY_BASIC__', '__CABLOY_START__'];
  const found = markers.find(m => existsSync(resolve(ROOT_DIR, m)));
  if (!found) {
    console.error(
      'Error: Not a cabloy project (no __CABLOY_BASIC__ or __CABLOY_START__ marker found)',
    );
    process.exit(1);
  }
}

// --- Step 2: Download & extract ---

async function fetchLatestPackageInfo(): Promise<LatestPackageInfo> {
  const url = `${NPM_REGISTRY}/${PACKAGE_NAME}/latest`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch package info: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { version?: string; dist?: { tarball?: string } };
  const version = data.version?.trim();
  const tarballUrl = data.dist?.tarball?.trim();
  if (!version || !isValidVersion(version)) {
    throw new Error(`Invalid latest Cabloy version from npm: ${version ?? '<missing>'}`);
  }
  if (!tarballUrl) {
    throw new Error('Missing tarball URL in npm latest metadata');
  }
  return { version, tarballUrl };
}

async function downloadTarball(tarballUrl: string): Promise<string> {
  const tmpFile = join(tmpdir(), `cabloy-upgrade-${Date.now()}.tgz`);
  const res = await fetch(tarballUrl);
  if (!res.ok) {
    throw new Error(`Failed to download tarball: ${res.status} ${res.statusText}`);
  }
  if (!res.body) {
    throw new Error('Failed to download tarball: empty response body');
  }
  mkdirSync(dirname(tmpFile), { recursive: true });
  const fileStream = createWriteStream(tmpFile);
  await pipeline(res.body, fileStream);
  return tmpFile;
}

async function downloadAndExtract(tarballUrl: string): Promise<void> {
  const tarballPath = await downloadTarball(tarballUrl);
  try {
    await extractTarball(tarballPath, TEMP_DIR);
  } finally {
    try {
      unlinkSync(tarballPath);
    } catch {}
  }
}

// --- Step 3: Selective overwrite ---

function selectiveOverwrite(dryRun?: boolean): void {
  const overwriteDirs = isCabloyBasic()
    ? [...OVERWRITE_DIRS, ...OVERWRITE_DIRS_CABLOY_BASIC]
    : OVERWRITE_DIRS;

  // Overwrite directories
  for (const dir of overwriteDirs) {
    const src = resolve(TEMP_DIR, dir);
    const dest = resolve(ROOT_DIR, dir);
    if (!existsSync(src)) continue;
    if (dryRun) {
      log(`  [dry-run] Overwrite directory: ${dir}`);
      continue;
    }
    if (existsSync(dest)) {
      rmSync(dest, { recursive: true, force: true });
    }
    copyDirectory(src, dest);
  }

  // Merge directories
  for (const dir of MERGE_DIRS) {
    const src = resolve(TEMP_DIR, dir);
    const dest = resolve(ROOT_DIR, dir);
    if (!existsSync(src)) continue;
    if (dryRun) {
      log(`  [dry-run] Merge directory: ${dir}`);
      continue;
    }
    copyDirectory(src, dest);
  }

  // Delete directories
  for (const dir of BLACKLIST_DIRS) {
    const dest = resolve(ROOT_DIR, dir);
    if (!existsSync(dest)) continue;
    if (dryRun) {
      log(`  [dry-run] Delete directory: ${dir}`);
      continue;
    }
    rmSync(dest, { recursive: true, force: true });
  }

  // Merge Cabloy Basic framework E2E directories without deleting project-owned paths.
  mergeFrameworkE2eAssets(dryRun);

  // Overwrite files
  for (const file of WHITELIST_FILES) {
    const src = resolve(TEMP_DIR, file);
    const dest = resolve(ROOT_DIR, file);
    if (!existsSync(src)) continue;
    if (dryRun) {
      log(`  [dry-run] Overwrite file: ${file}`);
      continue;
    }
    cpSync(src, dest);
  }
}

// --- Step 4: Run init ---

function runInit(dryRun: boolean, version: string): void {
  if (dryRun) {
    log('  [dry-run] Run: npm run init');
    return;
  }
  exec('npm run init', { CABLOY_VERSION: version } as any);
}

// --- Step 5: Run init:test-data ---

function runInitTestData(dryRun: boolean): void {
  if (dryRun) {
    log('  [dry-run] Run: npm run init:test-data');
    return;
  }
  exec('npm run init:test-data');
}

// --- Step 6: Cleanup ---

function cleanup(dryRun?: boolean): void {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  if (dryRun) {
    log('  [dry-run] Removed temp dir: node_modules/.cabloy-upgrade/');
  }
}

// --- Main ---

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  log('Cabloy Upgrade\n');

  // 1. Pre-flight
  preflight();

  const latestPackageInfo = await fetchLatestPackageInfo();
  const currentVersion = readVersionMarker();
  const basicE2eIncomplete = needsBasicE2eReconciliation();

  if (currentVersion) {
    log(`Current project Cabloy version: ${currentVersion}`);
  } else {
    log(
      `Warning: Missing ${VERSION_MARKER_FILE}, continuing with upgrade for backward compatibility.`,
    );
  }
  log(`Latest Cabloy version: ${latestPackageInfo.version}`);

  if (currentVersion) {
    const comparison = compareVersions(currentVersion, latestPackageInfo.version);
    if (comparison === 0) {
      if (basicE2eIncomplete) {
        log(
          `Cabloy is already up to date (current: ${currentVersion}), but the Cabloy Basic E2E baseline is incomplete. Repairing it in this upgrade; no additional upgrade command is required.\n`,
        );
      } else if (!dryRun) {
        log(`Cabloy is already up to date (current: ${currentVersion}). Skipping upgrade.`);
        return;
      } else {
        log(
          `Cabloy is already up to date (current: ${currentVersion}). Continuing dry-run to show overwrite plan.\n`,
        );
      }
    } else if (comparison > 0) {
      throw new Error(
        `Project Cabloy version ${currentVersion} is newer than npm latest ${latestPackageInfo.version}. Aborting upgrade.`,
      );
    } else {
      log(`Upgrading Cabloy from ${currentVersion} to ${latestPackageInfo.version}...\n`);
    }
  } else {
    log(`Upgrading Cabloy to ${latestPackageInfo.version}...\n`);
  }

  try {
    // 2. Download & extract
    log('Downloading latest cabloy from npm registry...');
    await downloadAndExtract(latestPackageInfo.tarballUrl);
    log('Downloaded and extracted successfully!\n');

    // 3. Selective overwrite
    log('Overwriting framework-owned files...');
    selectiveOverwrite(dryRun);
    log('');

    // 4. Reconcile Cabloy Basic framework E2E manifest entries
    if (isCabloyBasic()) {
      log('Reconciling framework-owned E2E package entries...');
      reconcileFrameworkE2ePackageJson(dryRun);
      log('');
    }

    // 5. Run init
    log('Running npm run init...');
    runInit(dryRun, latestPackageInfo.version);
    log('');

    // 6. Run init:test-data
    log('Running npm run init:test-data...');
    runInitTestData(dryRun);
    log('');

    if (dryRun) {
      log(`[dry-run] Current Cabloy version would become: ${latestPackageInfo.version}`);
    } else {
      log(`Current Cabloy version: ${readRequiredVersionMarker(latestPackageInfo.version)}`);
    }

    log('Upgrade complete!');
  } finally {
    // 6. Cleanup
    cleanup(dryRun);
  }
}

main().catch(err => {
  console.error(`\nUpgrade failed: ${err.message}`);
  process.exit(1);
});
