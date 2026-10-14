import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const startUrl = new URL('./start.ts', import.meta.url).href;

// Execute Start's real lifecycle with only its imported collaborators mocked. No application,
// environment files, database/Redis connections, or server listeners are created.
const lifecycleSource = `
  import assert from 'node:assert/strict';
  import { readFile } from 'node:fs/promises';
  import { registerHooks } from 'node:module';
  const startUrl = ${JSON.stringify(startUrl)};
  const mocks = {
    '../../types/index.ts': 'export const EnumAppEvent = { AppStartError: "error", AppStarted: "started" };',
    '../core/isolationGuard.ts': 'export function assertIsolatedTestConfig() {}',
    '../core/testClaim.ts': 'export function registerTestClaimResourceInventory() {}',
    '../module/loader.ts': 'export class ModuleLoader { async execute() { await globalThis.phase("Load"); } }',
    '../utils/util.ts': 'export function deepExtend(target, source) { Object.assign(target, source); }',
  };
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (context.parentURL === startUrl && mocks[specifier]) {
        return { url: 'data:text/javascript,' + encodeURIComponent(mocks[specifier]), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    },
  });
  const { Start } = await import(startUrl);
  const [projectPath, lockPath, lockContents, failingPhase] = process.argv.slice(1);
  const phases = [];
  const events = [];
  const failure = new Error(failingPhase);
  globalThis.phase = async phase => {
    assert.equal(await readFile(lockPath, 'utf8'), lockContents);
    phases.push(phase);
    if (phase === failingPhase) throw failure;
  };
  const config = {
    database: { testDatabase: true },
    server: { keys: ['test-key'], subdomainOffset: 2 },
    proxy: { enable: false, ipHeaders: 'X-Forwarded-For', maxIpsCount: 0 },
  };
  const app = {
    projectPath,
    name: 'app',
    meta: { env: { META_MODE: 'dev' } },
    options: { async config() {
      await globalThis.phase('Config');
      return { default: [() => config] };
    } },
    bean: { _newBean: Bean => new Bean() },
    util: { async monkeyModule(_appMonkey, _modulesMonkey, _forward, hook) {
      await globalThis.phase(hook.slice(3));
    } },
    emit(event, error) {
      events.push({ event, error, phases: [...phases] });
    },
  };
  const start = new Start(app);
  const order = ['Config', 'Load', 'Start', 'Ready', 'Started'];
  if (failingPhase) {
    await assert.rejects(start.start(), error => error === failure);
    assert.equal(app.meta.appStartError, failure);
    assert.deepEqual(phases, order.slice(0, order.indexOf(failingPhase) + 1));
    assert.equal(events.at(-1).event, 'error');
    assert.equal(events.at(-1).error, failure);
    assert.deepEqual(events.at(-1).phases, phases);
  } else {
    await start.start();
    assert.deepEqual(phases, order);
    assert.equal(app.meta.appStartError, undefined);
  }
  const reachesStarted = !failingPhase || failingPhase === 'Started';
  assert.equal(app.meta.appStarted, reachesStarted ? true : undefined);
  const reachesReady = reachesStarted || failingPhase === 'Ready';
  assert.equal(app.meta.appReady, reachesReady ? true : undefined);
  if (reachesReady) assert.deepEqual(app.meta.appReadyInstances, {});
  assert.deepEqual(events.map(item => item.event), [
    ...(reachesStarted ? ['started'] : []),
    ...(failingPhase ? ['error'] : []),
  ]);
  if (reachesStarted) {
    assert.deepEqual(events[0].phases, ['Config', 'Load', 'Start', 'Ready']);
  }
  assert.equal(await readFile(lockPath, 'utf8'), lockContents);
  console.log('verified');
`;

for (const failingPhase of ['', 'Config', 'Load', 'Start', 'Ready', 'Started']) {
  test(`Start ignores the legacy preparation lock on ${failingPhase ? `${failingPhase} failure` : 'success'}`, async () => {
    const root = await mkdtemp(path.join(await realpath(tmpdir()), 'vona-start-'));
    try {
      const identity = createHash('sha256')
        .update(JSON.stringify([root, 'app']))
        .digest('hex');
      const lockPath = path.join(root, '.app', 'dev-database-preparation', `${identity}.lock`);
      const lockContents = `${JSON.stringify({ token: 'legacy-owner', pid: process.pid })}\n`;
      await mkdir(path.dirname(lockPath), { recursive: true });
      await writeFile(lockPath, lockContents);
      const result = spawnSync(
        process.execPath,
        [
          '--input-type=module',
          '--eval',
          lifecycleSource,
          root,
          lockPath,
          lockContents,
          failingPhase,
        ],
        { encoding: 'utf8', timeout: 5_000 },
      );
      assert.ifError(result.error);
      assert.equal(result.signal, null, result.stderr);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout.trim(), 'verified');
      assert.equal(await readFile(lockPath, 'utf8'), lockContents);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
