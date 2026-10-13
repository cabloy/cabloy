import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

import type { VonaApplication } from '../vona/packages-vona/vona-core/src/lib/core/application.ts';

import {
  assertIsolatedTestConfig,
  assertIsolatedTestPath,
} from '../vona/packages-vona/vona-core/src/lib/core/isolationGuard.ts';
import {
  loadTestClaim,
  startTestClaimBroker,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import {
  allocateTestPort,
  createOwned,
  createTestRunId,
  getUnitTestCommands,
  reserveTestRun,
  ROOT_DIR,
  runIsolatedProcess,
  runIsolatedTest,
  verifyReadyProof,
  waitForReady,
} from './runIsolatedTest.ts';

const isolationSource = resolve(
  ROOT_DIR,
  'vona/packages-vona/vona-core/src/lib/core/testIsolation.ts',
);

test('public test scripts delegate to the isolated runner without recursion', () => {
  const root = JSON.parse(readFileSync(resolve(ROOT_DIR, 'package.json'), 'utf8'));
  const original = JSON.parse(
    readFileSync(resolve(ROOT_DIR, 'vona/package.original.json'), 'utf8'),
  );
  const working = JSON.parse(readFileSync(resolve(ROOT_DIR, 'vona/package.json'), 'utf8'));
  assert.equal(root.scripts.test, 'cd vona && npm run test');
  assert.equal(root.scripts['test:e2e'], 'node scripts/runIsolatedTest.ts e2e');
  assert.equal(original.scripts.test, 'node ../scripts/runIsolatedTest.ts unit');
  assert.equal(original.scripts.cov, 'node ../scripts/runIsolatedTest.ts unit --coverage');
  assert.equal(working.scripts.test, original.scripts.test);
  assert.equal(working.scripts.cov, original.scripts.cov);

  const commands = getUnitTestCommands(['--coverage', '--ci', 'src/test/example.test.ts']);
  assert.deepEqual(commands, [
    { command: 'npm', args: ['run', 'prerun'], cwd: resolve(ROOT_DIR, 'vona') },
    {
      command: process.execPath,
      args: [
        './packages-cli/cli/src/bin/vona.ts',
        ':bin:test',
        '--flavor=normal',
        '--coverage',
        '--ci=true',
        'src/test/example.test.ts',
      ],
      cwd: resolve(ROOT_DIR, 'vona'),
    },
  ]);
  assert.deepEqual(getUnitTestCommands(['src/test/example.test.ts', '--ci'])[1].args.slice(-2), [
    'src/test/example.test.ts',
    '--ci=true',
  ]);
});

test('creates a UTC timestamp and eight random hex digits for one run identity', () => {
  const date = new Date('2026-10-14T01:02:03.456Z');
  assert.match(createTestRunId(date), /^20261014010203-[a-f0-9]{8}$/);
});

test('creates exclusive manifest claims and refuses stale or symlinked roots', async () => {
  const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy-run-claim-'));
  const vonaDir = join(root, 'vona');
  const id = '20261014010203-a1b2c3d4';
  try {
    mkdirSync(vonaDir);
    const claim = await reserveTestRun(vonaDir, id);
    assert.equal(claim, join(vonaDir, '.vona-test-claim', `${id}.json`));
    await assert.rejects(reserveTestRun(vonaDir, id), { code: 'EEXIST' });
    const manifest = JSON.parse(readFileSync(claim, 'utf8'));
    assert.equal(manifest.runId, id);
    assert.equal(manifest.createdAt, '2026-10-14T01:02:03.000Z');
    assert.equal(manifest.owner.pid, process.pid);
    assert.ok(existsSync(claim));

    const staleRoot = join(vonaDir, `.app-test-${id}`);
    mkdirSync(staleRoot);
    writeFileSync(join(staleRoot, 'business-data'), 'keep');
    assert.throws(() => createOwned(staleRoot, id), /already exists/);
    assert.equal(readFileSync(join(staleRoot, 'business-data'), 'utf8'), 'keep');
    assert.equal(existsSync(join(staleRoot, '.vona-test-owner')), false);
    const linkedRoot = join(vonaDir, `.vona-test-${id}`);
    symlinkSync(staleRoot, linkedRoot);
    assert.throws(() => createOwned(linkedRoot, id), /already exists/);
    assert.equal(readFileSync(join(staleRoot, 'business-data'), 'utf8'), 'keep');

    const linked = join(root, 'linked');
    symlinkSync(vonaDir, linked);
    await assert.rejects(reserveTestRun(linked, '20261014010204-d4e5f6a7'), /Unsafe/);
    assert.equal(
      existsSync(join(vonaDir, '.vona-test-claim', '20261014010204-d4e5f6a7.json')),
      false,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('allocates a loopback listener without a persistent reservation', async () => {
  const first = await allocateTestPort();
  assert.ok(first > 0 && first <= 65535);
});

test('accepts only a signed, challenge-matching readiness response', () => {
  const key = 'a'.repeat(64);
  const challenge = 'b'.repeat(32);
  const proof = createHmac('sha256', key).update(challenge).digest('hex');
  assert.equal(verifyReadyProof(challenge, key, proof), true);
  assert.equal(verifyReadyProof('c'.repeat(32), key, proof), false);
  assert.equal(verifyReadyProof(challenge, 'c'.repeat(64), proof), false);
  assert.equal(verifyReadyProof(challenge, key, 'f'.repeat(64)), false);
  assert.equal(verifyReadyProof(challenge, key, null), false);
});

test('refuses an impostor occupying the allocated E2E port', async () => {
  const port = await allocateTestPort();
  const impostorKey = 'b'.repeat(64);
  const impostor = createServer((request, response) => {
    const challenge = request.headers['x-vona-test-challenge'];
    const proof = createHmac('sha256', impostorKey).update(String(challenge)).digest('hex');
    response.writeHead(200, {
      'content-type': 'application/json',
      'x-vona-test-proof': proof,
    });
    response.end('{"status":"ok"}');
  });
  await new Promise<void>((resolvePromise, reject) => {
    impostor.once('error', reject);
    impostor.listen(port, '127.0.0.1', resolvePromise);
  });
  try {
    await assert.rejects(
      waitForReady(
        port,
        { wait: () => new Promise(() => {}), stop: async () => undefined } as never,
        'a'.repeat(64),
      ),
      /does not belong to this test run/,
    );
  } finally {
    await new Promise<void>((resolvePromise, reject) => {
      impostor.close(error => (error ? reject(error) : resolvePromise()));
    });
  }
});

test('rejects external E2E targets before creating run directories', async () => {
  const previous = process.env.E2E_BASE_URL;
  process.env.E2E_BASE_URL = 'https://example.invalid';
  try {
    await assert.rejects(runIsolatedTest('unit', []), /E2E_BASE_URL is unsupported/);
  } finally {
    if (previous === undefined) delete process.env.E2E_BASE_URL;
    else process.env.E2E_BASE_URL = previous;
  }
});

test('resolves distinct run paths and rejects invalid identity without touching dev paths', () => {
  const script = `
    import { resolveVonaLocalPaths, getTestAppName } from ${JSON.stringify(isolationSource)};
    const project = '/project/vona';
    const a = resolveVonaLocalPaths(project, 'test', '20261014010203-a1b2c3d4');
    const b = resolveVonaLocalPaths(project, 'test', '20261014010203-d4e5f6a7');
    if (a.generatedRoot === b.generatedRoot || a.dataRoot === b.dataRoot) process.exit(1);
    if (getTestAppName(a.runId) === getTestAppName(b.runId)) process.exit(2);
    if (resolveVonaLocalPaths(project, 'dev', undefined).dataDir !== '.app') process.exit(3);
    if (resolveVonaLocalPaths(project, 'prod', undefined).generatedDir !== '.vona') process.exit(4);
    try { resolveVonaLocalPaths(project, 'dev', a.runId); process.exit(5); } catch {}
    try { resolveVonaLocalPaths(project, 'test', 'not-a-run-id'); process.exit(6); } catch {}
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
});

test('owner checks reject unowned paths and symlinked leaves', () => {
  const root = mkdtempSync(join(tmpdir(), 'cabloy-test-isolation-'));
  const id = '20261014010203-a1b2c3d4';
  const script = `
    import { assertTestRunOwner } from ${JSON.stringify(isolationSource)};
    const [unowned, linked] = process.argv.slice(1);
    try { assertTestRunOwner(unowned, ${JSON.stringify(id)}); process.exit(1); } catch {}
    try { assertTestRunOwner(linked, ${JSON.stringify(id)}); process.exit(2); } catch {}
  `;
  try {
    const owned = join(root, `.app-test-${id}`);
    mkdirSync(owned);
    writeFileSync(join(owned, '.vona-test-owner'), `${id}\n`);
    const unowned = join(root, 'unowned');
    mkdirSync(unowned);
    const linked = join(root, 'linked');
    symlinkSync(owned, linked);
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', script, unowned, linked],
      {
        cwd: ROOT_DIR,
        encoding: 'utf8',
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.ok(existsSync(owned));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('waits for descendants before reporting a successful child exit', async () => {
  if (process.platform === 'win32') return;
  const root = mkdtempSync(join(tmpdir(), 'cabloy-process-group-'));
  const flag = join(root, 'descendant-finished');
  try {
    const script = `
      import { spawn } from 'node:child_process';
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => require("node:fs").writeFileSync(process.argv[1], "done"), 400) ', process.argv[1]], { stdio: 'ignore' });
      child.unref();
    `;
    await runIsolatedProcess(
      process.execPath,
      ['--input-type=module', '-e', script, flag],
      ROOT_DIR,
      { ...process.env },
    );
    assert.equal(existsSync(flag), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a guardian waits for an inherited-group descendant before success', async () => {
  if (process.platform === 'win32') return;
  const root = mkdtempSync(join(resolve(ROOT_DIR, 'vona'), '.e2e-group-test-'));
  const flag = join(root, 'server-finished');
  try {
    const script = `
      import { spawn } from 'node:child_process';
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => require("node:fs").writeFileSync(process.argv[1], "done"), 400)', process.argv[1]], { stdio: 'ignore' });
      child.unref();
    `;
    await runIsolatedProcess(
      process.execPath,
      ['--input-type=module', '-e', script, flag],
      ROOT_DIR,
      { ...process.env },
    );
    assert.equal(existsSync(flag), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('managed guardians journal registration and drainage for successful and failed children', async () => {
  const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy-guardian-claim-'));
  const projectPath = join(root, 'vona');
  mkdirSync(projectPath);
  let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
  try {
    const runId = createTestRunId();
    const claimPath = await reserveTestRun(projectPath, runId);
    broker = await startTestClaimBroker(claimPath);
    const env = { ...process.env, ...broker.env, META_MODE: 'test', VONA_TEST_RUN_ID: runId };
    await runIsolatedProcess(process.execPath, ['-e', 'process.exit(0)'], ROOT_DIR, env);
    await assert.rejects(
      runIsolatedProcess(process.execPath, ['-e', 'process.exit(7)'], ROOT_DIR, env),
      /Isolated test exited: 7/,
    );
    const claim = await loadTestClaim(claimPath);
    assert.equal(claim.processes.length, 2);
    for (const item of claim.processes) {
      assert.equal(item.stage, 'drained');
      assert.equal(item.role, 'guardian');
      assert.equal(item.pid, item.pgid);
      assert.ok(item.host);
      assert.ok(item.startTime);
    }
  } finally {
    await broker?.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test('does not report success when a child exits nonzero', async () => {
  if (process.platform === 'win32') return;
  await assert.rejects(
    runIsolatedProcess(process.execPath, ['-e', 'process.exit(7)'], ROOT_DIR, { ...process.env }),
    /Isolated test exited: 7/,
  );
});

test('interrupts an owned group and waits for its graceful child shutdown', async () => {
  if (process.platform === 'win32') return;
  const root = mkdtempSync(join(resolve(ROOT_DIR, 'vona'), '.guardian-interrupt-test-'));
  const readyFile = join(root, 'ready');
  const stoppedFile = join(root, 'stopped');
  try {
    const script = `
      import { writeFileSync } from 'node:fs';
      writeFileSync(process.argv[1], 'ready');
      process.on('SIGINT', () => {
        setTimeout(() => {
          writeFileSync(process.argv[2], 'stopped');
          process.exit(0);
        }, 150);
      });
      setInterval(() => {}, 1000);
    `;
    const pending = runIsolatedProcess(
      process.execPath,
      ['--input-type=module', '-e', script, readyFile, stoppedFile],
      ROOT_DIR,
      { ...process.env },
    );
    const deadline = Date.now() + 5000;
    while (!existsSync(readyFile) && Date.now() < deadline) {
      await new Promise(resolvePromise => setTimeout(resolvePromise, 50));
    }
    assert.ok(existsSync(readyFile));
    process.emit('SIGINT');
    await assert.rejects(pending, /Isolated test exited/);
    assert.ok(existsSync(stoppedFile));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects merged paths, Redis prefixes, and database overrides before cleanup', () => {
  const root = mkdtempSync(join(resolve(ROOT_DIR, 'vona'), '.isolation-guard-test-'));
  const id = '20261014010203-a1b2c3d4';
  const name = `cabtest${id}`;
  const projectPath = join(root, 'vona');
  const dataRoot = join(projectPath, `.app-test-${id}`);
  const generatedRoot = join(projectPath, `.vona-test-${id}`);
  const port = 42321;
  try {
    mkdirSync(dataRoot, { recursive: true });
    mkdirSync(generatedRoot);
    writeFileSync(join(dataRoot, '.vona-test-owner'), `${id}\n`);
    writeFileSync(join(generatedRoot, '.vona-test-owner'), `${id}\n`);
    const sentinel = join(root, 'dev-business-data');
    writeFileSync(sentinel, 'keep');
    const config = {
      server: {
        publicDir: join(dataRoot, 'public'),
        workers: 1,
        listen: { hostname: '127.0.0.1', port },
        serve: { protocol: 'http', host: `127.0.0.1:${port}` },
      },
      logger: { baseDir: join(dataRoot, 'logs') },
      database: {
        testDatabase: true,
        base: {},
        defaultClient: 'sqlite3',
        clients: { sqlite3: { client: 'better-sqlite3', connection: { filename: '' } } },
      },
      instance: { instances: {} },
      redis: { base: {}, clients: { default: { keyPrefix: true }, queue: {} } },
    };
    const app = {
      name,
      projectPath,
      meta: { env: { META_MODE: 'test', VONA_TEST_RUN_ID: id, SERVER_LISTEN_PORT: String(port) } },
      config,
    } as unknown as VonaApplication;
    assertIsolatedTestConfig(app);
    config.server.publicDir = sentinel;
    assert.throws(() => assertIsolatedTestConfig(app), /path escapes/);
    config.server.publicDir = join(dataRoot, 'public');
    symlinkSync(sentinel, config.server.publicDir);
    assert.throws(() => assertIsolatedTestConfig(app), /symlink/);
    rmSync(config.server.publicDir);
    config.redis.clients.default.keyPrefix = false as unknown as true;
    assert.throws(() => assertIsolatedTestConfig(app), /framework-managed Redis prefix/);
    config.redis.clients.default.keyPrefix = true;
    config.database.clients.sqlite3.connection.filename = sentinel;
    assert.throws(() => assertIsolatedTestConfig(app), /discovery connection/);
    config.database.clients.sqlite3.connection.filename = '';
    (config.database.base as { connection?: { connectionString?: string } }).connection = {
      connectionString: 'postgres://localhost/development',
    };
    assert.throws(() => assertIsolatedTestConfig(app), /base connection target or pool/);
    delete (config.database.base as { connection?: unknown }).connection;
    (config.database.clients.sqlite3 as { connectionPool?: unknown }).connectionPool = {};
    assert.throws(() => assertIsolatedTestConfig(app), /external target or pool/);
    delete (config.database.clients.sqlite3 as { connectionPool?: unknown }).connectionPool;
    (config.database.clients as Record<string, unknown>).secondary = {
      client: 'pg',
      connection: { database: 'postgres', connectionString: 'postgres://localhost/development' },
    };
    assert.throws(() => assertIsolatedTestConfig(app), /external target or pool: secondary/);
    assert.equal(existsSync(sentinel), true);
    assert.equal(
      assertIsolatedTestPath(join(dataRoot, 'public'), join(dataRoot, 'public')),
      undefined,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
