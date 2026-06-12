import { execSync } from 'node:child_process';
import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import {
  copyFileSync,
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename } from 'node:path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const VONA_DIR = resolve(ROOT_DIR, 'vona');
const ZOVA_DIR = resolve(ROOT_DIR, 'zova');
const CABLOY_DOCS_DIR = resolve(ROOT_DIR, 'cabloy-docs');
const PNPM_VERSION = '11.5.2';

// --- Helpers ---

function generatePassword(length: number, exclude: string): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#%^&*()_+-=[]{}|;:,.<>?/~`';
  const pool = (upper + lower + digits + symbols).split('').filter(c => !exclude.includes(c));
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}

function exec(cmd: string, cwd = ROOT_DIR): void {
  execSync(cmd, { stdio: 'inherit', cwd });
}

function execQuiet(cmd: string, cwd = ROOT_DIR): string {
  return execSync(cmd, { stdio: 'pipe', cwd }).toString();
}

function pnpmInstall(cwd = ROOT_DIR): void {
  exec('pnpm install --config.confirmModulesPurge=false --no-frozen-lockfile', cwd);
}

function checkPnpm(): void {
  const version = execQuiet('pnpm --version').trimEnd();
  const [major, minor, patch] = version.split('.').map(item => Number.parseInt(item, 10) || 0);
  const lowerMajor = major < 11;
  const lowerMinor = major === 11 && minor < 5;
  const lowerPatch = major === 11 && minor === 5 && patch < 2;
  if (lowerMajor || lowerMinor || lowerPatch) {
    throw new Error(`pnpm should >= ${PNPM_VERSION}, current: ${version}`);
  }
}

function deleteGitkeepFiles(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      deleteGitkeepFiles(fullPath);
    } else if (entry.name === '.gitkeep') {
      rmSync(fullPath);
    }
  }
}

// --- Step 0: Set APP_NAME in .env files ---

function setAppName(): void {
  const projectName = basename(ROOT_DIR);
  const envFiles = [resolve(ROOT_DIR, 'vona/env/.env'), resolve(ROOT_DIR, 'zova/env/.env')];
  for (const filePath of envFiles) {
    if (!existsSync(filePath)) continue;
    let content = readFileSync(filePath, 'utf-8');
    content = content.replace(/^APP_NAME.*/m, `APP_NAME = ${projectName}`);
    writeFileSync(filePath, content);
    // eslint-disable-next-line
    console.log(`[init] Set APP_NAME = ${projectName} in ${filePath}`);
  }
}

// --- Step A: Generate vona/env/.env.prod.local ---

function generateEnvProdLocal(): void {
  const filePath = resolve(ROOT_DIR, 'vona/env/.env.prod.local');
  if (existsSync(filePath)) {
    // eslint-disable-next-line
    console.log('[init] vona/env/.env.prod.local already exists, skipping');
    return;
  }
  const serverKeys = `vona_${randomUUID()}_${Date.now()}_${randomInt(100, 10000)}`;
  const content = `SERVER_KEYS = ${serverKeys}\n`;
  writeFileSync(filePath, content);
  // eslint-disable-next-line
  console.log('[init] Generated vona/env/.env.prod.local');
}

// --- Step B: Generate vona/env/.env.prod.docker.local + docker-compose.yml ---

function generateEnvProdDockerLocal(): void {
  const envFilePath = resolve(ROOT_DIR, 'vona/env/.env.prod.docker.local');
  if (existsSync(envFilePath)) {
    // eslint-disable-next-line
    console.log('[init] vona/env/.env.prod.docker.local already exists, skipping');
    return;
  }

  const exclude = '\\\'"$';
  const pgPassword = generatePassword(16, exclude);
  const mysqlPassword = generatePassword(16, exclude);
  const mysqlRootPassword = generatePassword(16, exclude);

  // Write .env.prod.docker.local
  const envContent = `DATABASE_CLIENT_PG_PASSWORD = ${pgPassword}\nDATABASE_CLIENT_MYSQL_PASSWORD = ${mysqlPassword}\n`;
  writeFileSync(envFilePath, envContent);
  // eslint-disable-next-line
  console.log('[init] Generated vona/env/.env.prod.docker.local');

  // Copy docker-compose-original directory to docker-compose
  const composeDirOriginal = resolve(ROOT_DIR, 'vona/docker-compose-original');
  const composeDirTarget = resolve(ROOT_DIR, 'vona/docker-compose');
  if (!existsSync(composeDirTarget)) {
    cpSync(composeDirOriginal, composeDirTarget, {
      recursive: true,
      filter: src => !src.includes('.DS_Store') && !src.endsWith('docker-compose.original.yml'),
    });
    deleteGitkeepFiles(composeDirTarget);
    // eslint-disable-next-line
    console.log('[init] Generated vona/docker-compose directory');
  } else {
    // eslint-disable-next-line
    console.log('[init] vona/docker-compose directory already exists, skipping');
  }

  // Generate docker-compose.yml from template
  const composeOriginalPath = resolve(
    ROOT_DIR,
    'vona/docker-compose-original/docker-compose.original.yml',
  );
  const composeFilePath = resolve(ROOT_DIR, 'vona/docker-compose/docker-compose.yml');
  let composeContent = readFileSync(composeOriginalPath, 'utf-8');
  composeContent = composeContent.replace(
    /POSTGRES_PASSWORD:\s*'<placeholder>'/,
    `POSTGRES_PASSWORD: '${pgPassword}'`,
  );
  composeContent = composeContent.replace(
    /MYSQL_ROOT_PASSWORD:\s*'<placeholder>'/,
    `MYSQL_ROOT_PASSWORD: '${mysqlRootPassword}'`,
  );
  composeContent = composeContent.replace(
    /MYSQL_PASSWORD:\s*'<placeholder>'/,
    `MYSQL_PASSWORD: '${mysqlPassword}'`,
  );
  writeFileSync(composeFilePath, composeContent);
  // eslint-disable-next-line
  console.log('[init] Generated vona/docker-compose/docker-compose.yml');
}

// --- Step C: init:vona ---

function initVona(): void {
  // eslint-disable-next-line
  console.log('[init] Initializing vona...');
  const pkgPath = resolve(VONA_DIR, 'package.json');
  // if (!existsSync(pkgPath)) {
  copyFileSync(resolve(VONA_DIR, 'package.original.json'), pkgPath);
  pnpmInstall(VONA_DIR);
  // }
  exec('npm run vona :tools:deps');
}

// --- Step D: init:zova ---

function initZova(): void {
  // eslint-disable-next-line
  console.log('[init] Initializing zova...');
  const pkgPath = resolve(ZOVA_DIR, 'package.json');
  // if (!existsSync(pkgPath)) {
  copyFileSync(resolve(ZOVA_DIR, 'package.original.json'), pkgPath);
  pnpmInstall(ZOVA_DIR);
  // }
  exec('npm run zova :tools:deps');
}

// --- Step E: buildSsrCabloyBasicStartBatch ---

function buildSsrCabloyBasicStartBatch(): void {
  if (existsSync(resolve(ROOT_DIR, '__CABLOY_BASIC__'))) {
    // eslint-disable-next-line
    console.log('[init] Building zova SSR cabloyBasicBatch...');
    exec('pnpm run build:ssr:cabloyBasicBatch', ZOVA_DIR);
  } else if (existsSync(resolve(ROOT_DIR, '__CABLOY_START__'))) {
    // eslint-disable-next-line
    console.log('[init] Building zova SSR cabloyStartBatch...');
    exec('pnpm run build:ssr:cabloyStartBatch', ZOVA_DIR);
  }
}

// --- Step F: cleanupWorkspaceYaml ---

function cleanupWorkspaceYaml(): void {
  const subProjects = ['vona', 'zova'];
  for (const sub of subProjects) {
    const yamlPath = resolve(ROOT_DIR, sub, 'pnpm-workspace.yaml');
    if (!existsSync(yamlPath)) continue;
    let content = readFileSync(yamlPath, 'utf-8');
    const lines = content.split('\n');
    const filtered = lines.filter(line => {
      const trimmed = line.trim();
      if (trimmed === "'packages-docs'" || trimmed === 'packages-docs') return false;
      return true;
    });
    content = filtered.join('\n');
    writeFileSync(yamlPath, content);
    // eslint-disable-next-line
    console.log(`[init] Cleaned up ${sub}/pnpm-workspace.yaml`);
  }
}

// --- Step G: init:cabloy-docs ---

function initCabloyDocs(): void {
  const pkgPath = resolve(CABLOY_DOCS_DIR, 'package.json');
  if (!existsSync(pkgPath)) return;
  // eslint-disable-next-line
  console.log('[init] Initializing cabloy-docs...');
  pnpmInstall(CABLOY_DOCS_DIR);
}

// --- Main ---

checkPnpm();
pnpmInstall();
setAppName();
generateEnvProdLocal();
generateEnvProdDockerLocal();
cleanupWorkspaceYaml();
initVona();
initZova();
initCabloyDocs();
buildSsrCabloyBasicStartBatch();
// eslint-disable-next-line
console.log('[init] Done!');
