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
import { pathToFileURL } from 'node:url';

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
  reapBeforeIsolatedRun,
  resolveNpmCli,
  resolveCabloyEdition,
  ROOT_DIR,
  runIsolatedProcess,
  runIsolatedTest,
  startOwnedProcess,
  requestIsolatedVonaStop,
  withIsolatedVona,
  verifyReadyProof,
  waitForReady,
  withIsolatedRun,
} from './runIsolatedTest.ts';

const isolationSource = resolve(
  ROOT_DIR,
  'vona/packages-vona/vona-core/src/lib/core/testIsolation.ts',
);

test('claim reaping defaults remain enabled and contract opt-out never calls the reaper', async () => {
  const calls: string[] = [];
  const reap = async (projectPath: string) => {
    calls.push(projectPath);
    return [];
  };
  for (const kind of ['unit', 'cov', 'e2e', 'contract'] as const) {
    await reapBeforeIsolatedRun(kind, '/synthetic/vona', {}, reap);
  }
  assert.deepEqual(calls, [
    '/synthetic/vona',
    '/synthetic/vona',
    '/synthetic/vona',
    '/synthetic/vona',
  ]);
  await reapBeforeIsolatedRun(
    'contract',
    '/synthetic/vona',
    { skipExpiredClaimReaping: true },
    async () => {
      throw new Error('historical reaper must not run');
    },
  );
  for (const kind of ['unit', 'cov', 'e2e'] as const) {
    await assert.rejects(
      reapBeforeIsolatedRun(kind, '/synthetic/vona', { skipExpiredClaimReaping: true }, reap),
      /supported only for contract generation/,
    );
  }
  assert.equal(calls.length, 4);
});

test('public test entrypoints reject contract-only flags before claim reaping', () => {
  const runnerUrl = new URL('./runIsolatedTest.ts', import.meta.url).href;
  const source = `
    import assert from 'node:assert/strict';
    import { registerHooks } from 'node:module';
    globalThis.cleanupCalls = [];
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (context.parentURL === ${JSON.stringify(runnerUrl)} && specifier === './testClaimCleanup.ts') {
        const source = \`
          export function parseTestClaimTtlSeconds() { return 1; }
          export async function reapExpiredTestClaims() {
            globalThis.cleanupCalls.push('reap');
            throw new Error('unexpected claim reaping');
          }
          export async function cleanTestClaim() {
            globalThis.cleanupCalls.push('clean');
            throw new Error('unexpected claim cleanup');
          }
        \`;
        return { url: 'data:text/javascript,' + encodeURIComponent(source), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    } });
    const { runIsolatedTest } = await import(${JSON.stringify(runnerUrl)});
    for (const [kind, args] of [['unit', []], ['unit', ['--coverage']], ['e2e', []]]) {
      for (const suffix of ['', '=true', '=false', '=']) {
        await assert.rejects(
          runIsolatedTest(kind, [...args, '--skip-expired-claim-reaping' + suffix]),
          /--skip-expired-claim-reaping is supported only for contract generation/,
        );
        assert.deepEqual(globalThis.cleanupCalls, []);
      }
    }
    await assert.rejects(runIsolatedTest('unit', []), /unexpected claim reaping/);
    assert.deepEqual(globalThis.cleanupCalls, ['reap']);
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
    cwd: ROOT_DIR,
    env: { ...process.env, E2E_BASE_URL: undefined },
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr);
});

test('claim reaping errors propagate without retries', async () => {
  const error = new Error('synthetic reaper failure');
  let calls = 0;
  await assert.rejects(
    reapBeforeIsolatedRun('contract', '/synthetic/vona', {}, async () => {
      calls++;
      throw error;
    }),
    value => value === error,
  );
  assert.equal(calls, 1);
});

test('public test scripts delegate to the isolated runner without recursion', () => {
  const root = JSON.parse(readFileSync(resolve(ROOT_DIR, 'package.json'), 'utf8'));
  const original = JSON.parse(
    readFileSync(resolve(ROOT_DIR, 'vona/package.original.json'), 'utf8'),
  );
  const working = JSON.parse(readFileSync(resolve(ROOT_DIR, 'vona/package.json'), 'utf8'));
  assert.equal(root.scripts.test, 'cd vona && npm run test');
  assert.equal(root.scripts['test:e2e'], 'node scripts/runIsolatedTest.ts e2e');
  assert.equal(
    root.scripts['contract:generate:isolated'],
    'node scripts/generateOpenapiIsolated.ts',
  );
  assert.equal(original.scripts.test, 'node ../scripts/runIsolatedTest.ts unit');
  assert.equal(original.scripts.cov, 'node ../scripts/runIsolatedTest.ts unit --coverage');
  assert.equal(working.scripts.test, original.scripts.test);
  assert.equal(working.scripts.cov, original.scripts.cov);

  const commands = getUnitTestCommands(['--coverage', '--ci', 'src/test/example.test.ts']);
  assert.deepEqual(commands, [
    {
      command: process.execPath,
      args: [resolveNpmCli(), 'run', 'prerun'],
      cwd: resolve(ROOT_DIR, 'vona'),
    },
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

test('resolves the npm JavaScript entrypoint without a command shell', () => {
  const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy npm argv '));
  try {
    const cli = join(root, 'node_modules', 'npm', 'bin', 'npm-cli.js');
    mkdirSync(join(root, 'node_modules', 'npm', 'bin'), { recursive: true });
    writeFileSync(cli, '');
    const executable = join(root, process.platform === 'win32' ? 'node.exe' : 'node');
    assert.equal(resolveNpmCli({}, executable), realpathSync(cli));
    assert.equal(resolveNpmCli({ npm_execpath: cli }, '/missing/node'), realpathSync(cli));
    assert.throws(
      () => resolveNpmCli({ npm_execpath: join(root, 'pnpm.cjs') }, join(root, 'missing', 'node')),
      /Cannot resolve npm CLI/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test(
  'public npm test entrypoint can be invoked from CMD and PowerShell',
  {
    skip: process.platform !== 'win32' ? 'Native Windows shells are required' : false,
  },
  () => {
    const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy shell entry '));
    try {
      writeFileSync(join(root, '__CABLOY_BASIC__'), '');
      mkdirSync(join(root, 'vona'));
      const entry = resolve(ROOT_DIR, 'scripts/runIsolatedTest.ts');
      writeFileSync(
        join(root, 'package.json'),
        JSON.stringify({
          private: true,
          scripts: { test: `node "${entry}" unit` },
        }),
      );
      for (const [command, args] of [
        ['cmd.exe', ['/d', '/s', '/c', 'npm run test -- --ci']],
        [
          'pwsh.exe',
          [
            '-NoLogo',
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            'npm run test -- --ci; exit $LASTEXITCODE',
          ],
        ],
      ] as const) {
        const result = spawnSync(command, [...args], {
          cwd: root,
          env: { ...process.env, E2E_BASE_URL: 'https://example.invalid' },
          encoding: 'utf8',
          timeout: 30_000,
        });
        assert.equal(result.error, undefined);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /E2E_BASE_URL is unsupported/);
        assert.equal(existsSync(join(root, 'vona', '.vona-test-claim')), false);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);

test('accepts either Cabloy edition and rejects ambiguous or missing markers', () => {
  const root = mkdtempSync(join(tmpdir(), 'cabloy-run-edition-'));
  const basicMarker = join(root, '__CABLOY_BASIC__');
  const startMarker = join(root, '__CABLOY_START__');
  try {
    assert.throws(() => resolveCabloyEdition(root), /Not a Cabloy project/);

    writeFileSync(basicMarker, '');
    assert.equal(resolveCabloyEdition(root), 'basic');

    writeFileSync(startMarker, '');
    assert.throws(() => resolveCabloyEdition(root), /Ambiguous Cabloy edition/);

    rmSync(basicMarker);
    assert.equal(resolveCabloyEdition(root), 'start');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
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
    symlinkSync(staleRoot, linkedRoot, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => createOwned(linkedRoot, id), /already exists/);
    assert.equal(readFileSync(join(staleRoot, 'business-data'), 'utf8'), 'keep');

    const linked = join(root, 'linked');
    symlinkSync(vonaDir, linked, process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(reserveTestRun(linked, '20261014010204-d4e5f6a7'), /Unsafe/);
    assert.equal(
      existsSync(join(vonaDir, '.vona-test-claim', '20261014010204-d4e5f6a7.json')),
      false,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

for (const marker of ['__CABLOY_BASIC__', '__CABLOY_START__']) {
  test(
    `contract runs clean owned roots on success and retain failed-run evidence for ${marker}`,
    { concurrency: false },
    async () => {
      const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy-contract-run-'));
      mkdirSync(join(root, 'vona'));
      writeFileSync(join(root, marker), '');
      let claimPath = '';
      let dataRoot = '';
      let generatedRoot = '';
      const previous = process.env.VONA_TEST_REQUIRE_FRESH_RESOURCES;
      try {
        process.env.VONA_TEST_REQUIRE_FRESH_RESOURCES = 'true';
        await withIsolatedRun(
          'contract',
          async context => {
            assert.equal(context.env.VONA_TEST_REQUIRE_FRESH_RESOURCES, undefined);
          },
          root,
        );
        assert.equal(
          await withIsolatedRun(
            'contract',
            async context => {
              ({ claimPath, dataRoot, generatedRoot } = context);
              assert.equal((await loadTestClaim(claimPath)).kind, 'contract');
              assert.equal(context.env.META_MODE, 'test');
              assert.equal(context.env.VONA_DB_RESET, undefined);
              assert.equal(context.env.VONA_TEST_READY_KEY, undefined);
              assert.equal(context.env.VONA_TEST_REQUIRE_FRESH_RESOURCES, 'true');
              assert.ok(existsSync(join(dataRoot, '.vona-test-owner')));
              return 'generated';
            },
            root,
            { skipExpiredClaimReaping: true },
          ),
          'generated',
        );
        assert.equal(existsSync(claimPath), false);
        assert.equal(existsSync(dataRoot), false);
        assert.equal(existsSync(generatedRoot), false);
        await assert.rejects(
          withIsolatedRun(
            'contract',
            async context => {
              ({ claimPath, dataRoot, generatedRoot } = context);
              throw new Error('generator failed');
            },
            root,
            { skipExpiredClaimReaping: true },
          ),
          /generator failed/,
        );
        assert.equal((await loadTestClaim(claimPath)).status, 'failed');
        assert.equal(existsSync(dataRoot), true);
        assert.equal(existsSync(generatedRoot), true);
      } finally {
        if (previous === undefined) delete process.env.VONA_TEST_REQUIRE_FRESH_RESOURCES;
        else process.env.VONA_TEST_REQUIRE_FRESH_RESOURCES = previous;
        rmSync(root, { recursive: true, force: true });
      }
    },
  );
}

test('readiness retries signed not-ready responses and rejects server exit or timeout', async () => {
  const key = 'a'.repeat(64);
  let requests = 0;
  const listener = createServer((req, res) => {
    requests++;
    res.writeHead(requests === 1 ? 503 : 200, {
      'content-type': 'application/json',
      'x-vona-test-proof': createHmac('sha256', key)
        .update(String(req.headers['x-vona-test-challenge']))
        .digest('hex'),
    });
    res.end(JSON.stringify({ status: requests === 1 ? 'starting' : 'ok' }));
  });
  await new Promise<void>(resolve => listener.listen(0, '127.0.0.1', resolve));
  const address = listener.address();
  assert.ok(address && typeof address !== 'string');
  const pending = { wait: () => new Promise(() => {}), stop: async () => undefined } as never;
  try {
    await waitForReady(address.port, pending, key, 2000);
    assert.equal(requests, 2);
    await assert.rejects(waitForReady(address.port, pending, key, 0), /did not become ready/);
    await assert.rejects(
      waitForReady(
        address.port,
        {
          wait: async () => ({ type: 'drained', failed: true }),
          stop: async () => ({ type: 'drained', failed: true }),
        },
        key,
      ),
      /exited before readiness/,
    );
  } finally {
    await new Promise<void>((resolve, reject) =>
      listener.close(error => (error ? reject(error) : resolve())),
    );
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
    import { resolveVonaLocalPaths, getTestAppName } from ${JSON.stringify(pathToFileURL(isolationSource).href)};
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
    import { assertTestRunOwner } from ${JSON.stringify(pathToFileURL(isolationSource).href)};
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
    symlinkSync(owned, linked, process.platform === 'win32' ? 'junction' : 'dir');
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
  const root = mkdtempSync(join(tmpdir(), 'cabloy-process-group-'));
  const flag = join(root, 'descendant-finished');
  try {
    const script = `
      import { spawn } from 'node:child_process';
      // Avoid libuv's parent-owned kill-on-close Job on Windows; the outer Job still owns this child.
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => require("node:fs").writeFileSync(process.argv[1], "done"), 400)', process.argv[1]], { stdio: 'ignore', detached: process.platform === 'win32' });
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
  const root = mkdtempSync(join(resolve(ROOT_DIR, 'vona'), '.e2e-group-test-'));
  const flag = join(root, 'server-finished');
  try {
    const script = `
      import { spawn } from 'node:child_process';
      // Preserve the inherited POSIX group, but avoid libuv's kill-on-close Job on Windows.
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => require("node:fs").writeFileSync(process.argv[1], "done"), 400)', process.argv[1]], { stdio: 'ignore', detached: process.platform === 'win32' });
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
      if (process.platform === 'win32') {
        assert.equal(item.containment, 'windows-job');
        assert.equal(item.pgid, undefined);
        assert.ok(item.jobId);
      } else {
        assert.equal(item.pid, item.pgid);
      }
      assert.ok(item.host);
      assert.ok(item.startTime);
    }
  } finally {
    await broker?.close();
    rmSync(root, { recursive: true, force: true });
  }
});

test('does not report success when a child exits nonzero', async () => {
  await assert.rejects(
    runIsolatedProcess(process.execPath, ['-e', 'process.exit(7)'], ROOT_DIR, { ...process.env }),
    /Isolated test exited: 7/,
  );
});

test(
  'interrupts an owned group and waits for its graceful child shutdown',
  {
    skip:
      process.platform === 'win32'
        ? 'Windows cancellation terminates the Job; POSIX graceful signals are not supported'
        : false,
  },
  async () => {
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
  },
);

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

function shutdownFixture(
  options: {
    readyFailure?: boolean;
    requestFailure?: boolean;
    fallbackFailure?: boolean;
    drainageFailure?: boolean;
    earlyExit?: boolean;
    hang?: boolean;
    code?: number;
  } = {},
) {
  const events: string[] = [];
  let finish!: (result: import('./runIsolatedTest.ts').GuardianResult) => void;
  const result = {
    type: 'drained' as const,
    failed: !!options.drainageFailure,
    result: { code: options.code ?? 0, signal: null },
  };
  const waited = new Promise<import('./runIsolatedTest.ts').GuardianResult>(resolve => {
    finish = resolve;
  });
  const server = {
    wait: () => waited,
    stop: async () => {
      events.push('force-stop');
      if (options.fallbackFailure) throw new Error('fallback failed');
      finish(result);
      return result;
    },
  };
  const dependencies = {
    platform: 'win32' as const,
    shutdownTimeoutMs: 30,
    start: async () => {
      events.push('start');
      return server;
    },
    ready: async () => {
      events.push('ready');
      if (options.earlyExit) {
        finish(result);
        await Promise.resolve();
      }
      if (options.readyFailure) throw new Error('readiness failed');
    },
    requestStop: async () => {
      events.push('cooperative-stop');
      if (options.requestFailure) throw new Error('authorization failed');
      if (!options.hang) finish(result);
    },
  };
  return { dependencies, events, server };
}

test('Windows verified-readiness teardown requests cooperative shutdown then waits without force-stop', async () => {
  const f = shutdownFixture();
  const before = process.listenerCount('SIGINT');
  assert.equal(
    await withIsolatedVona(
      1234,
      { VONA_TEST_RUN_ID: '20261014010203-a1b2c3d4' },
      async () => {
        f.events.push('callback');
        return 'done';
      },
      f.dependencies,
    ),
    'done',
  );
  assert.deepEqual(f.events, ['start', 'ready', 'callback', 'cooperative-stop']);
  assert.equal(process.listenerCount('SIGINT'), before);
});

for (const options of [
  { requestFailure: true },
  { hang: true },
  { drainageFailure: true },
  { code: 1 },
]) {
  test(`Windows cooperative failure always force-stops and fails (${JSON.stringify(options)})`, async () => {
    const f = shutdownFixture(options);
    await assert.rejects(withIsolatedVona(1234, {}, async () => {}, f.dependencies));
    assert.deepEqual(f.events, ['start', 'ready', 'cooperative-stop', 'force-stop']);
  });
}

test('Windows readiness failure or early exit never requests cooperative shutdown', async () => {
  for (const options of [{ readyFailure: true }, { earlyExit: true }]) {
    const f = shutdownFixture(options);
    await assert.rejects(withIsolatedVona(1234, {}, async () => {}, f.dependencies));
    assert.deepEqual(f.events, ['start', 'ready', 'force-stop']);
  }
});

test('Windows interruption is failure and uses force-stop, not authenticated normal shutdown', async () => {
  const f = shutdownFixture();
  await assert.rejects(
    withIsolatedVona(
      1234,
      {},
      async () => {
        process.emit('SIGINT');
      },
      f.dependencies,
    ),
    /interrupted/,
  );
  assert.equal(f.events.includes('cooperative-stop'), false);
  assert.ok(f.events.includes('force-stop'));
});

test('callback, cooperative shutdown and fallback errors all survive', async () => {
  const f = shutdownFixture({ requestFailure: true, fallbackFailure: true });
  await assert.rejects(
    withIsolatedVona(
      1234,
      {},
      async () => {
        throw new Error('callback failed');
      },
      f.dependencies,
    ),
    (error: unknown) => {
      assert.ok(error instanceof AggregateError);
      assert.equal(error.errors[0].message, 'callback failed');
      assert.ok(error.errors[1] instanceof AggregateError);
      assert.deepEqual(
        error.errors[1].errors.map((e: Error) => e.message),
        ['authorization failed', 'fallback failed'],
      );
      return true;
    },
  );
});

test('callback error survives a clean Windows cooperative shutdown', async () => {
  const f = shutdownFixture();
  await assert.rejects(
    withIsolatedVona(
      1234,
      {},
      async () => {
        throw new Error('callback failed');
      },
      f.dependencies,
    ),
    /callback failed/,
  );
  assert.deepEqual(f.events, ['start', 'ready', 'cooperative-stop']);
});

test('POSIX teardown preserves the existing stop path', async () => {
  const f = shutdownFixture();
  await withIsolatedVona(1234, {}, async () => {}, { ...f.dependencies, platform: 'darwin' });
  assert.deepEqual(f.events, ['start', 'ready', 'force-stop']);
});

test('shutdown HTTP request uses distinct nonce-bound domains and rejects invalid acknowledgments or redirects', async () => {
  const key = 'a'.repeat(64);
  const runId = '20261014010203-a1b2c3d4';
  let mode = 'ok';
  let requests = 0;
  const listener = createServer((req, res) => {
    requests++;
    assert.equal(req.method, 'POST');
    assert.equal(req.url, '/health/test-stop');
    const nonce = req.headers['x-vona-test-stop-nonce'];
    assert.match(String(nonce), /^[a-f0-9]{32}$/);
    const payload = `${runId}\nPOST\n/health/test-stop\n${nonce}`;
    const sign = (value: string) => createHmac('sha256', key).update(value).digest('hex');
    assert.equal(
      req.headers['x-vona-test-stop-authorization'],
      sign(`vona-test-stop-request-v1\n${payload}`),
    );
    assert.equal(JSON.stringify(req.headers).includes(key), false);
    if (mode === 'timeout') return;
    if (mode === 'redirect') {
      res.writeHead(307, { location: '/health/test-stop' });
      res.end();
      return;
    }
    const proof =
      mode === 'ready-proof' ? sign(String(nonce)) : sign(`vona-test-stop-ack-v1\n${payload}`);
    res.writeHead(mode === 'refuse' ? 403 : 200, {
      'x-vona-test-stop-proof': mode === 'bad-proof' ? 'f'.repeat(64) : proof,
    });
    res.end(JSON.stringify({ status: mode === 'bad-body' ? 'ok' : 'stopping' }));
  });
  await new Promise<void>(resolve => listener.listen(0, '127.0.0.1', resolve));
  const address = listener.address();
  assert.ok(address && typeof address !== 'string');
  try {
    await requestIsolatedVonaStop(address.port, runId, key);
    for (mode of ['bad-proof', 'ready-proof', 'refuse', 'bad-body', 'redirect', 'timeout']) {
      const before = requests;
      await assert.rejects(requestIsolatedVonaStop(address.port, runId, key, 40));
      assert.equal(requests, before + 1);
    }
  } finally {
    listener.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      listener.close(error => (error ? reject(error) : resolve())),
    );
  }
});

test(
  'cooperative worker exit retains native guardian full drainage proof (Windows Job on Windows)',
  { timeout: 30_000 },
  async () => {
    const root = mkdtempSync(join(realpathSync(tmpdir()), 'cabloy cooperative worker '));
    const marker = join(root, 'closed');
    const descendant = join(root, 'descendant');
    const port = await allocateTestPort();
    const workerUrl = new URL(
      '../vona/packages-vona/vona-core/src/lib/framework/processWorker.ts',
      import.meta.url,
    ).href;
    const source = `
    import { createServer } from 'node:http';
    import { createHmac } from 'node:crypto';
    import { spawn } from 'node:child_process';
    import { writeFileSync } from 'node:fs';
    import { registerHooks } from 'node:module';
    const workerUrl = ${JSON.stringify(workerUrl)};
    globalThis.closeMock = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      writeFileSync(${JSON.stringify(marker)}, 'closed');
    };
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (context.parentURL === workerUrl) {
        const source = {
          '@cabloy/utils': 'export async function catchError(fn) { try { return [await fn()]; } catch (error) { return [undefined, error]; } } export function catchErrorSync(fn) { try { return [fn()]; } catch (error) { return [undefined, error]; } }',
          './useApp.ts': 'export const closeApp = globalThis.closeMock; export function useApp() {}',
        }[specifier];
        if (source) return { url: 'data:text/javascript,' + encodeURIComponent(source), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    } });
    const { closeProcessWorker } = await import(workerUrl);
    const sign = payload => createHmac('sha256', process.env.VONA_TEST_READY_KEY).update(payload).digest('hex');
    const listener = createServer((req, res) => {
      if (req.url === '/health/ready') {
        res.writeHead(200, { 'x-vona-test-proof': sign(String(req.headers['x-vona-test-challenge'])) });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }
      const payload = process.env.VONA_TEST_RUN_ID + '\\nPOST\\n/health/test-stop\\n' + req.headers['x-vona-test-stop-nonce'];
      if (req.method !== 'POST' || req.url !== '/health/test-stop' || req.headers['x-vona-test-stop-authorization'] !== sign('vona-test-stop-request-v1\\n' + payload)) {
        res.writeHead(403); res.end(); return;
      }
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => require("node:fs").writeFileSync(process.argv[1], "done"), 300)', ${JSON.stringify(descendant)}], { stdio: 'ignore', detached: process.platform === 'win32' });
      child.unref();
      res.writeHead(200, { 'x-vona-test-stop-proof': sign('vona-test-stop-ack-v1\\n' + payload) });
      res.once('finish', () => void closeProcessWorker());
      res.end(JSON.stringify({ status: 'stopping' }));
    });
    listener.listen(${port}, '127.0.0.1');
  `;
    try {
      await withIsolatedVona(
        port,
        { ...process.env, META_MODE: 'test', VONA_TEST_RUN_ID: '20261014010203-a1b2c3d4' },
        async () => {},
        {
          platform: 'win32',
          start: (_command, _args, cwd, env) =>
            startOwnedProcess(process.execPath, ['--input-type=module', '-e', source], cwd, env),
          ready: waitForReady,
        },
      );
      assert.equal(readFileSync(marker, 'utf8'), 'closed');
      assert.equal(readFileSync(descendant, 'utf8'), 'done');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);
