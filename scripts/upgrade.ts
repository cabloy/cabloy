import { execSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { cpSync, existsSync, mkdirSync, rmSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const NPM_REGISTRY = 'https://registry.npmjs.org';
const PACKAGE_NAME = 'cabloy';
const TEMP_DIR = resolve(ROOT_DIR, 'node_modules/.cabloy-upgrade');

// --- Whitelist ---

const WHITELIST_DIRS: string[] = [
  // root
  'scripts',
  '.husky',
  // vona
  'vona/packages-vona',
  'vona/packages-cli',
  'vona/packages-utils',
  'vona/src/suite-vendor',
  'vona/src/module-vendor',
  'vona/scripts',
  'vona/docker-compose-original',
  // zova
  'zova/packages-zova',
  'zova/packages-cli',
  'zova/packages-utils',
  'zova/src/suite-vendor',
  'zova/src/module-vendor',
  'zova/src/boot',
  'zova/src-ssr',
  'zova/scripts',
];

const WHITELIST_FILES: string[] = [
  // root
  'package.json',
  'tsconfig.json',
  'tsconfig.base.json',
  'tsconfig.base.esm.json',
  'oxfmt.config.ts',
  'oxlint.config.ts',
  'lint-staged.config.mjs',
  'LICENSE',
  // vona
  'vona/package.original.json',
  'vona/pnpm-workspace.yaml',
  'vona/lerna.json',
  'vona/tsconfig.json',
  'vona/tsconfig.base.json',
  'vona/tsconfig.base.esm.json',
  'vona/oxfmt.config.ts',
  'vona/oxlint.config.ts',
  'vona/nginx.conf',
  'vona/docker-compose.original.yml',
  'vona/docker-compose-dockerfile-app',
  'vona/codecov.yml',
  // zova
  'zova/package.original.json',
  'zova/pnpm-workspace.yaml',
  'zova/lerna.json',
  'zova/tsconfig.json',
  'zova/tsconfig.base.json',
  'zova/tsconfig.base.esm.json',
  'zova/tsconfig.rest.json',
  'zova/tsconfig.vue-tsc.json',
  'zova/oxfmt.config.ts',
  'zova/oxlint.config.ts',
  'zova/quasar.config.ts',
  'zova/quasar.extensions.json',
  'zova/postcss.config.js',
  'zova/index.html',
  'zova/openapi.config.ts',
];

// --- Helpers ---

// oxlint-disable no-console
const log = console.log; // eslint-disable-line no-console

function exec(cmd: string): void {
  execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR });
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

async function fetchLatestTarballUrl(): Promise<string> {
  const url = `${NPM_REGISTRY}/${PACKAGE_NAME}/latest`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch package info: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { dist: { tarball: string } };
  return data.dist.tarball;
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
  // @ts-expect-error Node.js ReadableStream vs Web ReadableStream
  await pipeline(res.body, fileStream);
  return tmpFile;
}

async function extractTarball(tarballPath: string, targetDir: string): Promise<void> {
  mkdirSync(targetDir, { recursive: true });
  const exitCode = execSync(`tar --strip-components=1 -xzf "${tarballPath}" -C "${targetDir}"`, {
    stdio: 'pipe',
  });
  if (exitCode !== 0) {
    throw new Error('Failed to extract tarball');
  }
}

async function downloadAndExtract(): Promise<void> {
  const tarballUrl = await fetchLatestTarballUrl();
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
  // Overwrite directories
  for (const dir of WHITELIST_DIRS) {
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
    cpSync(src, dest, { recursive: true, filter: src => !src.includes('.DS_Store') });
  }

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

// --- Step 4: Delete generated package.json files ---

function deleteGeneratedPackageJsons(dryRun?: boolean): void {
  const files = ['vona/package.json', 'zova/package.json'];
  for (const file of files) {
    const filePath = resolve(ROOT_DIR, file);
    if (!existsSync(filePath)) continue;
    if (dryRun) {
      log(`  [dry-run] Delete: ${file}`);
      continue;
    }
    rmSync(filePath);
  }
}

// --- Step 5: Run init ---

function runInit(dryRun?: boolean): void {
  if (dryRun) {
    log('  [dry-run] Run: npm run init');
    return;
  }
  exec('npm run init');
}

// --- Step 6: Cleanup ---

function cleanup(dryRun?: boolean): void {
  if (dryRun) {
    log('  [dry-run] Remove temp dir: node_modules/.cabloy-upgrade/');
    return;
  }
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

// --- Main ---

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  log('Cabloy Upgrade\n');

  // 1. Pre-flight
  preflight();

  // 2. Download & extract
  log('Downloading latest cabloy from npm registry...');
  await downloadAndExtract();
  log('Downloaded and extracted successfully!\n');

  // 3. Selective overwrite
  log('Overwriting framework-owned files...');
  selectiveOverwrite(dryRun);
  log('');

  // 4. Delete generated package.json
  log('Removing generated package.json files...');
  deleteGeneratedPackageJsons(dryRun);
  log('');

  // 5. Run init
  log('Running npm run init...');
  runInit(dryRun);
  log('');

  // 6. Cleanup
  cleanup(dryRun);

  log('Upgrade complete!');
}

main().catch(err => {
  console.error(`\nUpgrade failed: ${err.message}`);
  process.exit(1);
});
