import { execSync } from 'node:child_process';
import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
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
    console.log('[init] vona/env/.env.prod.local already exists, skipping');
    return;
  }
  const serverKeys = `vona_${randomUUID()}_${Date.now()}_${randomInt(100, 10000)}`;
  const content = `SERVER_KEYS = ${serverKeys}\n`;
  writeFileSync(filePath, content);
  console.log('[init] Generated vona/env/.env.prod.local');
}

// --- Step B: Generate vona/env/.env.prod.docker.local + docker-compose.yml ---

function generateEnvProdDockerLocal(): void {
  const envFilePath = resolve(ROOT_DIR, 'vona/env/.env.prod.docker.local');
  const composeFilePath = resolve(ROOT_DIR, 'vona/docker-compose.yml');
  if (existsSync(envFilePath)) {
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
  console.log('[init] Generated vona/env/.env.prod.docker.local');

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
  console.log('[init] Generated vona/docker-compose.yml');
}

// --- Step C: init:vona ---

function initVona(): void {
  console.log('[init] Initializing vona...');
  const pkgPath = resolve(ROOT_DIR, 'vona/package.json');
  if (!existsSync(pkgPath)) {
    copyFileSync(resolve(ROOT_DIR, 'vona/package.original.json'), pkgPath);
  }
  exec("pnpm --dir './vona' run init");
}

// --- Step D: init:zova ---

function initZova(): void {
  console.log('[init] Initializing zova...');
  const pkgPath = resolve(ROOT_DIR, 'zova/package.json');
  if (!existsSync(pkgPath)) {
    copyFileSync(resolve(ROOT_DIR, 'zova/package.original.json'), pkgPath);
  }
  exec("pnpm --dir './zova' run init");
}

// --- Main ---

generateEnvProdLocal();
generateEnvProdDockerLocal();
initVona();
initZova();
console.log('[init] Done!');
