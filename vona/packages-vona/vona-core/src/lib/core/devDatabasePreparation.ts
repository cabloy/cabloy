import { createHash, randomUUID } from 'node:crypto';
import { mkdir, open, readFile, realpath, unlink } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';

interface DevDatabasePreparationApp {
  projectPath: string;
  name: string;
  meta: { env: { META_MODE: string } };
  config: object;
}

interface DevDatabasePreparationOptions {
  timeoutMs?: number;
  reset?: boolean;
}

export async function getDevDatabasePreparationPath(projectPath: string, appName: string) {
  const checkout = await realpath(projectPath);
  const identity = createHash('sha256')
    .update(JSON.stringify([checkout, appName]))
    .digest('hex');
  // Keep the guard separate from generated files and disposable runtime/public contents.
  return path.join(checkout, '.app', 'dev-database-preparation', `${identity}.lock`);
}

export async function acquireDevDatabasePreparation(
  app: DevDatabasePreparationApp,
  options: DevDatabasePreparationOptions = {},
): Promise<(() => Promise<void>) | undefined> {
  if (app.meta.env.META_MODE !== 'dev') return;
  const reset = options.reset ?? process.env.VONA_DB_RESET === 'true';
  const config = app.config as { database?: { testDatabase?: boolean } };
  if (reset && config.database?.testDatabase !== true) {
    throw new Error('db:reset requires database.testDatabase=true in the dev configuration');
  }
  if (config.database?.testDatabase !== true) return;

  const timeoutMs = options.timeoutMs ?? 300_000;
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new Error('Development database preparation timeout must be finite and nonnegative');
  }
  const guardPath = await getDevDatabasePreparationPath(app.projectPath, app.name);
  await mkdir(path.dirname(guardPath), { recursive: true, mode: 0o700 });
  const owner = `${JSON.stringify({ token: randomUUID(), pid: process.pid })}\n`;
  const started = performance.now();
  let handle;
  while (true) {
    try {
      handle = await open(guardPath, 'wx', 0o600);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
    }
    const remaining = timeoutMs - (performance.now() - started);
    if (remaining <= 0) throw timeoutError(guardPath, timeoutMs);
    await delay(Math.min(100, remaining));
    if (performance.now() - started >= timeoutMs) throw timeoutError(guardPath, timeoutMs);
  }

  try {
    await handle.writeFile(owner);
  } catch (error) {
    // Exclusive creation established ownership even if writing the token failed.
    await unlink(guardPath);
    throw error;
  } finally {
    await handle.close();
  }

  let released = false;
  return async () => {
    if (released) return;
    if ((await readFile(guardPath, 'utf8')) !== owner) {
      throw new Error(`Development database preparation guard ownership changed: ${guardPath}`);
    }
    await unlink(guardPath);
    released = true;
  };
}

function timeoutError(guardPath: string, timeoutMs: number) {
  return new Error(
    `Timed out after ${timeoutMs}ms waiting for development database preparation guard: ${guardPath}. ` +
      'Wait for the owning startup/reset to finish. If it has exited, confirm no preparation process ' +
      'is still running for this checkout and app, then manually remove this exact guard file and retry. ' +
      'The guard is never automatically stolen or removed as stale.',
  );
}
