import { execSync } from 'node:child_process';
import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import { copyFileSync, cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

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

function exec(cmd: string): void {
  execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR });
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
  const composeFilePath = resolve(ROOT_DIR, 'vona/docker-compose.yml');
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
      filter: src => !src.includes('.DS_Store'),
    });
    // eslint-disable-next-line
    console.log('[init] Generated vona/docker-compose directory');
  } else {
    // eslint-disable-next-line
    console.log('[init] vona/docker-compose directory already exists, skipping');
  }

  // Generate docker-compose.yml from original
  const composeOriginalPath = resolve(ROOT_DIR, 'vona/docker-compose.original.yml');
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
  console.log('[init] Generated vona/docker-compose.yml');
}

// --- Step C: init:vona ---

function initVona(): void {
  // eslint-disable-next-line
  console.log('[init] Initializing vona...');
  const pkgPath = resolve(ROOT_DIR, 'vona/package.json');
  if (!existsSync(pkgPath)) {
    copyFileSync(resolve(ROOT_DIR, 'vona/package.original.json'), pkgPath);
  }
  exec("pnpm --dir './vona' run init");
}

// --- Step D: init:zova ---

function initZova(): void {
  // eslint-disable-next-line
  console.log('[init] Initializing zova...');
  const pkgPath = resolve(ROOT_DIR, 'zova/package.json');
  if (!existsSync(pkgPath)) {
    copyFileSync(resolve(ROOT_DIR, 'zova/package.original.json'), pkgPath);
  }
  exec("pnpm --dir './zova' run init");
}

// --- Step E: cleanupWorkspaceYaml ---

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

// --- Main ---

generateEnvProdLocal();
generateEnvProdDockerLocal();
cleanupWorkspaceYaml();
initVona();
initZova();
// eslint-disable-next-line
console.log('[init] Done!');
