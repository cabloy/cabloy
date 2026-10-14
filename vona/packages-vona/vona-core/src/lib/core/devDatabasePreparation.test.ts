import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';

import {
  acquireDevDatabasePreparation,
  getDevDatabasePreparationPath,
} from './devDatabasePreparation.ts';

const helperUrl = new URL('./devDatabasePreparation.ts', import.meta.url).href;
const startUrl = new URL('../framework/start.ts', import.meta.url).href;
const workerSource = `
  import { open, unlink } from 'node:fs/promises';
  import { acquireDevDatabasePreparation, getDevDatabasePreparationPath } from ${JSON.stringify(helperUrl)};
  const [projectPath, name, timeoutMs] = process.argv.slice(1);
  const commands = [];
  let receive;
  process.on('message', message => receive ? receive(message) : commands.push(message));
  const nextCommand = () => new Promise(resolve => {
    if (commands.length) resolve(commands.shift());
    else receive = message => { receive = undefined; resolve(message); };
  });
  const send = message => new Promise(resolve => process.send(message, resolve));
  const app = { projectPath, name, meta: { env: { META_MODE: 'dev' } },
    config: { database: { testDatabase: true } } };
  try {
    await send({ event: 'attempting' });
    const release = await acquireDevDatabasePreparation(app, { timeoutMs: Number(timeoutMs), reset: false });
    const guardPath = await getDevDatabasePreparationPath(projectPath, name);
    const criticalPath = guardPath + '.critical';
    try {
      // A second process entering before release fails exclusive creation, not a timing assertion.
      const critical = await open(criticalPath, 'wx');
      await critical.close();
      try {
        await send({ event: 'acquired', guardPath });
        const command = await nextCommand();
        if (command === 'fail') throw new Error('preparation failed');
      } finally {
        await unlink(criticalPath);
      }
    } finally {
      await release();
    }
    await send({ event: 'released' });
  } catch (error) {
    await send({ event: 'error', message: error.message });
  } finally {
    process.disconnect();
  }
`;

async function fixture() {
  const root = await mkdtemp(path.join(await realpath(tmpdir()), 'vona-dev-preparation-'));
  const projectPath = path.join(root, 'vona');
  await mkdir(projectPath);
  const workers: ReturnType<typeof worker>[] = [];
  return {
    root,
    projectPath,
    launch(
      name = 'app',
      timeoutMs = 5_000,
      source = workerSource,
      extraArgs: string[] = [],
      checkout = projectPath,
    ) {
      const child = worker(source, [checkout, name, String(timeoutMs), ...extraArgs]);
      workers.push(child);
      return child;
    },
    async dispose() {
      for (const child of workers) {
        if (child.process.exitCode === null && child.process.signalCode === null)
          child.process.kill('SIGKILL');
      }
      await Promise.all(workers.map(child => child.exit));
      await rm(root, { recursive: true, force: true });
    },
  };
}

interface WorkerMessage {
  event: string;
  message?: string;
  guardPath?: string;
}

function worker(source: string, args: string[]) {
  const child = spawn(process.execPath, ['--input-type=module', '--eval', source, ...args], {
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
  });
  let stderr = '';
  child.stderr!.setEncoding('utf8').on('data', chunk => {
    stderr += chunk;
  });
  const messages: WorkerMessage[] = [];
  child.on('message', message => messages.push(message as WorkerMessage));
  const exit = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
    (resolve, reject) => {
      child.once('error', reject);
      child.once('exit', (code, signal) => resolve({ code, signal }));
    },
  );
  return {
    process: child,
    messages,
    exit,
    async wait(event: string) {
      const deadline = performance.now() + 10_000;
      while (true) {
        const message = messages.find(item => item.event === event);
        if (message) return message;
        if (child.exitCode !== null || child.signalCode !== null || performance.now() >= deadline) {
          throw new Error(`Worker did not send ${event}: ${JSON.stringify(messages)} ${stderr}`);
        }
        await delay(10);
      }
    },
  };
}

function appFixture(projectPath: string, mode = 'dev', testDatabase = true) {
  return {
    projectPath,
    name: 'app',
    meta: { env: { META_MODE: mode } },
    config: { database: { testDatabase } },
  };
}

async function assertMissing(file: string) {
  await assert.rejects(access(file), { code: 'ENOENT' });
}

test('only disposable development preparation is guarded; reset requires true before filesystem access', async () => {
  const f = await fixture();
  try {
    // These paths do not exist: skipped modes must not canonicalize paths or write files.
    const missing = path.join(f.root, 'missing');
    for (const mode of ['test', 'prod']) {
      assert.equal(
        await acquireDevDatabasePreparation(appFixture(missing, mode), { reset: true }),
        undefined,
      );
    }
    assert.equal(
      await acquireDevDatabasePreparation(appFixture(missing, 'dev', false), { reset: false }),
      undefined,
    );
    await assert.rejects(
      acquireDevDatabasePreparation(appFixture(missing, 'dev', false), { reset: true }),
      /requires database.testDatabase=true/,
    );
    const withoutDatabaseModule = { ...appFixture(missing), config: {} };
    assert.equal(
      await acquireDevDatabasePreparation(withoutDatabaseModule, { reset: false }),
      undefined,
    );
    await assert.rejects(
      acquireDevDatabasePreparation(withoutDatabaseModule, { reset: true }),
      /requires database.testDatabase=true/,
    );
    await assertMissing(path.join(f.projectPath, '.app'));
    await assert.rejects(
      acquireDevDatabasePreparation(appFixture(f.projectPath), {
        timeoutMs: Infinity,
        reset: false,
      }),
      /finite and nonnegative/,
    );
    await assertMissing(path.join(f.projectPath, '.app'));
  } finally {
    await f.dispose();
  }
});

test('canonical checkout and app name define identity outside generated/runtime/public roots', async () => {
  const f = await fixture();
  try {
    const alias = path.join(f.root, 'alias');
    await symlink(f.projectPath, alias);
    const guardPath = await getDevDatabasePreparationPath(f.projectPath, 'app');
    assert.equal(await getDevDatabasePreparationPath(alias, 'app'), guardPath);
    assert.equal(
      path.dirname(guardPath),
      path.join(f.projectPath, '.app', 'dev-database-preparation'),
    );
    assert.notEqual(await getDevDatabasePreparationPath(f.projectPath, 'other'), guardPath);
    const other = path.join(f.root, 'other');
    await mkdir(other);
    assert.notEqual(await getDevDatabasePreparationPath(other, 'app'), guardPath);
    const release = await acquireDevDatabasePreparation(appFixture(alias), { reset: true });
    try {
      const owner = JSON.parse(await readFile(guardPath, 'utf8'));
      assert.equal(owner.pid, process.pid);
      assert.equal(typeof owner.token, 'string');
      for (const disposable of ['.vona', '.app/runtime', '.app/public']) {
        await rm(path.join(f.projectPath, disposable), { recursive: true, force: true });
      }
      await access(guardPath);
    } finally {
      await release?.();
    }
    await release?.();
    await assertMissing(guardPath);
  } finally {
    await f.dispose();
  }
});

test('release refuses another owner token and preserves the replacement guard', async () => {
  const f = await fixture();
  try {
    const release = await acquireDevDatabasePreparation(appFixture(f.projectPath), {
      reset: false,
    });
    const guardPath = await getDevDatabasePreparationPath(f.projectPath, 'app');
    const replacement = JSON.stringify({ token: 'another-owner', pid: process.pid });
    await writeFile(guardPath, replacement);
    await assert.rejects(release!(), /ownership changed/);
    assert.equal(await readFile(guardPath, 'utf8'), replacement);
  } finally {
    await f.dispose();
  }
});

test('real subprocesses serialize the same canonical checkout/app and release after exceptions', async () => {
  const f = await fixture();
  try {
    const holder = f.launch();
    const held = await holder.wait('acquired');
    const alias = path.join(f.root, 'alias');
    await symlink(f.projectPath, alias);
    // Launch the contender through a different spelling of the same checkout.
    const contender = f.launch('app', 5_000, workerSource, [], alias);
    await contender.wait('attempting');
    await delay(150);
    assert.equal(
      contender.messages.some(item => item.event === 'acquired'),
      false,
    );
    holder.process.send('fail');
    assert.equal((await holder.wait('error')).message, 'preparation failed');
    assert.deepEqual(await holder.exit, { code: 0, signal: null });
    assert.equal((await contender.wait('acquired')).guardPath, held.guardPath);
    contender.process.send('finish');
    await contender.wait('released');
    assert.deepEqual(await contender.exit, { code: 0, signal: null });
    await assertMissing(held.guardPath!);
  } finally {
    await f.dispose();
  }
});

test('different app identities may prepare concurrently in real subprocesses', async () => {
  const f = await fixture();
  try {
    const first = f.launch('first');
    const second = f.launch('second');
    const [a, b] = await Promise.all([first.wait('acquired'), second.wait('acquired')]);
    assert.notEqual(a.guardPath, b.guardPath);
    first.process.send('finish');
    second.process.send('finish');
    await Promise.all([first.wait('released'), second.wait('released')]);
    await Promise.all([assertMissing(a.guardPath!), assertMissing(b.guardPath!)]);
  } finally {
    await f.dispose();
  }
});

test('subprocess timeout preserves a live guard and reports its exact recovery path', async () => {
  const f = await fixture();
  try {
    const holder = f.launch();
    const held = await holder.wait('acquired');
    const original = await readFile(held.guardPath!, 'utf8');
    const contender = f.launch('app', 100);
    const error = await contender.wait('error');
    assert.ok(error.message?.includes(held.guardPath!));
    assert.match(error.message!, /Timed out after 100ms/);
    assert.match(error.message!, /confirm no preparation process/);
    assert.match(error.message!, /manually remove this exact guard file/);
    assert.equal(await readFile(held.guardPath!, 'utf8'), original);
    assert.equal(
      contender.messages.some(item => item.event === 'acquired'),
      false,
    );
    assert.deepEqual(await contender.exit, { code: 0, signal: null });
    holder.process.send('finish');
    await holder.wait('released');
  } finally {
    await f.dispose();
  }
});

test('killed subprocess leaves its orphan guard intact; contenders never steal even an old guard', async () => {
  const f = await fixture();
  try {
    const holder = f.launch();
    const held = await holder.wait('acquired');
    const original = await readFile(held.guardPath!, 'utf8');
    holder.process.kill('SIGKILL');
    assert.deepEqual(await holder.exit, { code: null, signal: 'SIGKILL' });
    await utimes(held.guardPath!, new Date(0), new Date(0));
    const contender = f.launch('app', 100);
    assert.match((await contender.wait('error')).message!, /never automatically stolen/);
    assert.equal(await readFile(held.guardPath!, 'utf8'), original);
    assert.equal(
      contender.messages.some(item => item.event === 'acquired'),
      false,
    );
    assert.deepEqual(await contender.exit, { code: 0, signal: null });
  } finally {
    await f.dispose();
  }
});

// Stub only startup's imported collaborators; execute its actual lifecycle without loading the app,
// reading environment files, connecting to databases/Redis, or starting servers.
const lifecycleSource = `
  import assert from 'node:assert/strict';
  import { access } from 'node:fs/promises';
  import { registerHooks } from 'node:module';
  import { acquireDevDatabasePreparation, getDevDatabasePreparationPath } from ${JSON.stringify(helperUrl)};
  const startUrl = ${JSON.stringify(startUrl)};
  const mocks = {
    '../../types/index.ts': 'export const EnumAppEvent = { AppStartError: "error" };',
    '../core/isolationGuard.ts': 'export function assertIsolatedTestConfig() {}',
    '../core/testClaim.ts': 'export function registerTestClaimResourceInventory() {}',
    '../module/loader.ts': 'export class ModuleLoader {}',
    '../utils/util.ts': 'export function deepExtend() {}',
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
  const [projectPath, name, timeoutMs, failingPhase] = process.argv.slice(1);
  const app = { projectPath, name, meta: { env: { META_MODE: 'dev' } },
    emit(event, error) { assert.equal(event, 'error'); assert.equal(error.message, failingPhase); } };
  const phases = [];
  const guardPath = await getDevDatabasePreparationPath(projectPath, name);
  const start = new Start(app);
  start._start_appConfig = async () => {
    await assert.rejects(access(guardPath), { code: 'ENOENT' });
    app.config = { database: { testDatabase: true } };
    phases.push('config');
  };
  for (const phase of ['Load', 'Start', 'Ready', 'Started']) {
    start['_start_app' + phase] = async () => {
      await access(guardPath);
      await assert.rejects(acquireDevDatabasePreparation(app, { timeoutMs: 0, reset: false }), /Timed out/);
      phases.push(phase);
      if (phase === failingPhase) throw new Error(phase);
    };
  }
  if (failingPhase) {
    await assert.rejects(start.start(), { message: failingPhase });
    assert.equal(app.meta.appStartError.message, failingPhase);
    assert.deepEqual(phases, ['config', 'Load', 'Start', 'Ready', 'Started'].slice(0, ['Load', 'Start', 'Ready', 'Started'].indexOf(failingPhase) + 2));
  } else {
    await start.start();
    assert.deepEqual(phases, ['config', 'Load', 'Start', 'Ready', 'Started']);
  }
  await assert.rejects(access(guardPath), { code: 'ENOENT' });
  process.send({ event: 'verified' }, () => process.disconnect());
`;

test('actual Start holds the guard through every phase and finally releases on success or phase failure', async () => {
  const f = await fixture();
  try {
    for (const phase of ['', 'Load', 'Start', 'Ready', 'Started']) {
      const child = f.launch('app', 5_000, lifecycleSource, [phase]);
      await child.wait('verified');
      assert.deepEqual(await child.exit, { code: 0, signal: null });
    }
  } finally {
    await f.dispose();
  }
});
