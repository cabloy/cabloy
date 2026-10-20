import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { registerHooks } from 'node:module';
import { resolve } from 'node:path';
import { finished } from 'node:stream/promises';
import { test } from 'node:test';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { inspect } from 'node:util';

import type { GuardianResult, OwnedProcess } from './runIsolatedTest.ts';

import {
  requiresFreshTestResources,
  TEST_REQUIRE_FRESH_RESOURCES_ENV,
} from '../vona/packages-vona/vona-core/src/lib/core/testStrictMode.ts';
import {
  discardNativeOutput,
  guardianStdio,
  reportIsolatedDiagnostic,
  StrictGenerationError,
  strictGenerationFailure,
  usesStrictGeneration,
} from './strictGenerationDiagnostics.ts';

const runnerUrl = new URL('./runIsolatedTest.ts', import.meta.url).href;
const generatorUrl = new URL('./generateOpenapiIsolated.ts', import.meta.url).href;
const freshnessUrl = new URL(
  '../vona/packages-vona/vona-core/src/lib/core/testFreshness.ts',
  import.meta.url,
).href;
const SECRET = 'synthetic-private-diagnostic-9a72';
const SOURCE = 'http://127.0.0.1:47123/swagger/json?version=V31';
const ordinaryEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  META_FLAVOR: 'normal',
  META_MODE: 'test',
};
const strictEnv: NodeJS.ProcessEnv = { ...ordinaryEnv, VONA_TEST_REQUIRE_FRESH_RESOURCES: 'true' };
const drained: GuardianResult = {
  type: 'drained',
  failed: false,
  result: { code: 0, signal: null },
};

function privateError() {
  return new AggregateError([new Error(SECRET)], SECRET, { cause: new Error(SECRET) });
}

function deferred<T>() {
  let resolvePromise!: (value: T) => void;
  const promise = new Promise<T>(resolveValue => {
    resolvePromise = resolveValue;
  });
  return { promise, resolve: resolvePromise };
}

function assertSafe(error: unknown, stage: string) {
  assert.ok(error instanceof StrictGenerationError);
  assert.equal(error.stage, stage);
  assert.equal(error.message, `Strict contract generation failed: ${stage}`);
  assert.equal(Object.hasOwn(error, 'cause'), false);
  assert.equal(Object.hasOwn(error, 'errors'), false);
  assert.deepEqual(Object.getOwnPropertyNames(error).sort(), ['message', 'name', 'stack', 'stage']);
  const visible = inspect(error, { showHidden: true, depth: 20 });
  assert.ok(!visible.includes(SECRET), 'raw synthetic diagnostic escaped');
  assert.ok(!visible.includes(SOURCE), 'source URL escaped');
  return true;
}

let state: ReturnType<typeof fixture>;

class FakeGuardian extends EventEmitter {
  connected = true;
  readonly pid: number;
  readonly messages: any[] = [];
  startMessage?: any;

  constructor(pid: number) {
    super();
    this.pid = pid;
  }

  send(message: any, callback?: (error: Error | null) => void) {
    this.messages.push(message);
    if (message.type === 'start') {
      this.startMessage = message;
      callback?.(null);
      queueMicrotask(() => {
        this.emit('message', { type: 'started' });
        if (message.args.includes(':openapi:generate') && state.generatorCompletes) {
          queueMicrotask(() => this.complete(state.generatorResult));
        }
      });
    } else if (message.type === 'stop') {
      this.complete(drained);
    }
    return true;
  }

  complete(result?: GuardianResult) {
    if (!this.connected) return;
    if (result) this.emit('message', result);
    this.connected = false;
    this.emit('close', 0, null);
  }
}

function fixture() {
  const directories = new Set<string>();
  const writes: { path: string; value: string; options: unknown }[] = [];
  const updates: any[] = [];
  const claimEvents: any[] = [];
  const guardians: FakeGuardian[] = [];
  const launches: { command: string; args: string[]; options: any }[] = [];
  const calls: string[] = [];
  const inventory = {
    databases: [{ clientName: 'main', prefix: 'synthetic-db-', endpoint: { dialect: 'pg' } }],
    redis: [{ clientName: 'main', prefix: 'synthetic-redis:' }],
  };
  return {
    directories,
    writes,
    updates,
    claimEvents,
    guardians,
    launches,
    calls,
    inventory,
    cleanupStatus: 'cleaned',
    cleanupWarn: false,
    cleanupThrows: false,
    statusThrows: false,
    brokerCloseThrows: false,
    generatorCompletes: true,
    generatorResult: drained,
    pendingAck: undefined as Promise<void> | undefined,
    registeredAck: undefined as Promise<void> | undefined,
    nativeOutput: undefined as ReturnType<typeof discardNativeOutput> | undefined,
    nativeResult: undefined as OwnedProcess | undefined,
    localEntries: [] as string[],
    fetchMode: 'ok',
    fetches: [] as { source: string; options: RequestInit | undefined }[],
    fs: {
      existsSync: (path: string) => path.endsWith('/__CABLOY_BASIC__'),
      realpathSync: () => {
        throw new Error('Unexpected npm path resolution');
      },
      mkdirSync: (path: string) => {
        calls.push('mkdir');
        assert.equal(directories.has(path), false);
        directories.add(path);
      },
      writeFileSync: (path: string, value: string, options: unknown) => {
        writes.push({ path, value, options });
      },
    },
    createServer: () => {
      calls.push('allocate');
      const server = new EventEmitter() as EventEmitter & {
        listen: (port: number, host: string, callback: () => void) => void;
        address: () => { port: number };
        close: (callback: (error?: Error) => void) => void;
      };
      server.listen = (port, host, callback) => {
        assert.equal(port, 0);
        assert.equal(host, '127.0.0.1');
        callback();
      };
      server.address = () => ({ port: 47123 });
      server.close = callback => callback();
      return server;
    },
  };
}

state = fixture();
const globalKey = '__strictDiagnosticsHarness';
const globals = globalThis as typeof globalThis & { [globalKey]?: Record<string, any> };
const previousGlobal = Object.getOwnPropertyDescriptor(globalThis, globalKey);
const bridge = `globalThis.${globalKey}`;
const virtual = (source: string) => ({
  url: `data:text/javascript,${encodeURIComponent(source)}`,
  shortCircuit: true as const,
});

// Only these production parents can see virtual collaborators. No app, env-file,
// disk resource, listener, broker, native helper or real child is constructed.
Object.defineProperty(globalThis, globalKey, {
  configurable: true,
  value: {
    fs: (name: keyof ReturnType<typeof fixture>['fs'], ...args: any[]) =>
      Reflect.apply(state.fs[name], undefined, args),
    createServer: () => state.createServer(),
    spawn: (command: string, args: string[], options: any) => {
      state.calls.push('spawn');
      state.launches.push({ command, args, options });
      const guardian = new FakeGuardian(41000 + state.guardians.length);
      state.guardians.push(guardian);
      queueMicrotask(() => guardian.emit('message', { type: 'ready' }));
      return guardian;
    },
    createClaim: async (project: string, runId: string, kind: string, owner: unknown) => {
      state.calls.push('claim');
      assert.equal(kind, 'contract');
      assert.deepEqual(owner, {
        pid: process.pid,
        startTime: 'synthetic-start',
        host: 'synthetic',
      });
      return { claimPath: resolve(project, '.vona-test-claim', `${runId}-${SECRET}.json`) };
    },
    broker: async () => {
      state.calls.push('broker');
      return {
        env: { VONA_TEST_CLAIM_URL: 'http://synthetic.invalid', VONA_TEST_CLAIM_TOKEN: SECRET },
        update: async (event: any) => {
          state.updates.push(event);
          if (event.status === 'failed' && state.statusThrows) throw privateError();
        },
        close: async () => {
          state.calls.push('broker-close');
          if (state.brokerCloseThrows) throw privateError();
        },
      };
    },
    claimEvent: async (_env: unknown, event: any) => {
      state.claimEvents.push(event);
      if (event.process.stage === 'pending') await state.pendingAck;
      if (event.process.stage === 'registered') await state.registeredAck;
    },
    inspectProcess: async (pid: number) => ({
      pid,
      pgid: pid,
      startTime: 'synthetic-start',
      host: 'synthetic',
    }),
    inactive: async () => true,
    clean: async (_path: string, options: any) => {
      state.calls.push('cleanup');
      assert.equal(await options.isInactive({}), true);
      if (state.cleanupWarn) options.warn(`${SECRET} ${SOURCE}`);
      if (state.cleanupThrows) throw privateError();
      return { status: state.cleanupStatus };
    },
    reap: async () => {
      state.calls.push('reap');
    },
    windows: async (
      _command: string,
      _args: string[],
      _cwd: string,
      _env: unknown,
      output: any,
    ) => {
      state.nativeOutput = output;
      assert.ok(state.nativeResult, 'Windows fixture must supply lifecycle proof');
      return state.nativeResult;
    },
    lstat: async () => ({ isDirectory: () => true }),
    readdir: async () => state.localEntries,
    inventory: () => state.inventory,
    assertConfig: () => state.calls.push('config-guard'),
    assertPath: () => state.calls.push('path-guard'),
  },
});

const runnerMocks: Record<string, string> = {
  'node:fs': ['existsSync', 'realpathSync', 'mkdirSync', 'writeFileSync']
    .map(name => `export function ${name}(...args) { return ${bridge}.fs('${name}', ...args); }`)
    .join('\n'),
  'node:net': `export function createServer() { return ${bridge}.createServer(); }`,
  'node:child_process': `export function spawn(...args) { return ${bridge}.spawn(...args); }`,
  '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts': `
    export function createTestClaim(...args) { return ${bridge}.createClaim(...args); }
    export function startTestClaimBroker(...args) { return ${bridge}.broker(...args); }
    export function hasTestClaimTransport(env) { return !!env.VONA_TEST_CLAIM_TOKEN; }
    export function sendTestClaimEvent(...args) { return ${bridge}.claimEvent(...args); }
  `,
  './testClaimCleanup.ts': `
    export function cleanTestClaim(...args) { return ${bridge}.clean(...args); }
    export function reapExpiredTestClaims(...args) { return ${bridge}.reap(...args); }
    export function parseTestClaimTtlSeconds() { return 1; }
  `,
  './testClaimProcesses.ts': `
    export function inspectTestProcess(...args) { return ${bridge}.inspectProcess(...args); }
    export function isTestClaimInactive(...args) { return ${bridge}.inactive(...args); }
  `,
  './testProcessGuardianWindows.ts': `
    export function startWindowsOwnedProcess(...args) { return ${bridge}.windows(...args); }
  `,
};
const freshnessMocks: Record<string, string> = {
  'node:fs/promises': `
    export function lstat(...args) { return ${bridge}.lstat(...args); }
    export function readdir(...args) { return ${bridge}.readdir(...args); }
  `,
  './isolationGuard.ts': `
    export function assertIsolatedTestConfig() { return ${bridge}.assertConfig(); }
    export function assertIsolatedTestPath() { return ${bridge}.assertPath(); }
  `,
  './testIsolation.ts': `
    export function resolveVonaLocalPaths() {
      return { publicRoot: '/synthetic/public', runtimeRoot: '/synthetic/runtime', sqliteRoot: '/synthetic/sqlite' };
    }
  `,
  './testClaim.ts': `
    export function buildTestClaimResourceInventory() { return ${bridge}.inventory(); }
    export function mergeTestClaimDatabaseOptions(...args) { return Object.assign({}, ...args); }
    export function mergeTestClaimRedisOptions(...args) { return Object.assign({}, ...args); }
  `,
};
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    const mocks =
      context.parentURL === runnerUrl
        ? runnerMocks
        : context.parentURL === freshnessUrl
          ? freshnessMocks
          : undefined;
    if (mocks && Object.hasOwn(mocks, specifier)) return virtual(mocks[specifier]);
    return nextResolve(specifier, context);
  },
});
let runner: typeof import('./runIsolatedTest.ts');
let generator: typeof import('./generateOpenapiIsolated.ts');
let freshness: typeof import('../vona/packages-vona/vona-core/src/lib/core/testFreshness.ts');
try {
  runner = await import(runnerUrl);
  generator = await import(generatorUrl);
  freshness = await import(freshnessUrl);
} finally {
  hooks.deregister();
}

function lifecycle(options: { start?: boolean; ready?: boolean; stop?: boolean } = {}) {
  const calls: string[] = [];
  const closed = deferred<GuardianResult>();
  const server: OwnedProcess = {
    wait: () => closed.promise,
    stop: async () => {
      calls.push('stop');
      if (options.stop) throw privateError();
      closed.resolve(drained);
      return drained;
    },
  };
  return {
    calls,
    dependencies: {
      platform: 'darwin' as const,
      start: async () => {
        calls.push('start');
        if (options.start) throw privateError();
        return server;
      },
      ready: async () => {
        calls.push('ready');
        if (options.ready) throw privateError();
      },
    },
  };
}

function installFetch() {
  globalThis.fetch = async (input, options) => {
    const source = String(input);
    state.fetches.push({ source, options });
    if (source.endsWith('/health/ready')) {
      const server = state.guardians.find(child => child.startMessage?.args.includes(':bin:dev'));
      assert.ok(server?.startMessage);
      const challenge = new Headers(options?.headers).get('x-vona-test-challenge');
      assert.ok(challenge);
      const key = server.startMessage.env.VONA_TEST_READY_KEY;
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'x-vona-test-proof': createHmac('sha256', key).update(challenge).digest('hex') },
      });
    }
    assert.equal(source, SOURCE, 'no alternate source or fallback request is permitted');
    if (state.fetchMode === 'request-error') throw privateError();
    if (state.fetchMode === 'json-error') {
      return {
        ok: true,
        json: async () => {
          throw privateError();
        },
      } as unknown as Response;
    }
    if (state.fetchMode === 'http-error') return new Response(SECRET, { status: 503 });
    if (state.fetchMode === 'shape-error') return new Response(JSON.stringify({ private: SECRET }));
    return new Response(JSON.stringify({ openapi: '3.1.0', paths: {} }));
  };
}

test(
  'strict contract diagnostics use only fake resources and preserve lifecycle proof',
  { concurrency: false },
  async t => {
    const originalConsole = console.error;
    const originalFetch = globalThis.fetch;
    const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform')!;
    const savedEnv = new Map(
      [TEST_REQUIRE_FRESH_RESOURCES_ENV, 'E2E_BASE_URL'].map(key => [key, process.env[key]]),
    );
    const diagnostics: unknown[][] = [];
    console.error = (...values) => {
      diagnostics.push(values);
    };
    delete process.env.E2E_BASE_URL;
    Object.defineProperty(process, 'platform', { ...originalPlatform, value: 'darwin' });
    const reset = () => {
      state = fixture();
      diagnostics.length = 0;
    };
    const assertPrivate = () => {
      const output = inspect(diagnostics, { depth: 20, showHidden: true });
      assert.ok(!output.includes(SECRET), 'raw synthetic diagnostic was logged');
      assert.ok(!output.includes(SOURCE), 'source URL was logged');
    };
    try {
      await t.test('strict flag parsing, safe errors and ordinary diagnostic behavior', () => {
        assert.equal(requiresFreshTestResources(ordinaryEnv), false);
        assert.equal(requiresFreshTestResources(strictEnv), true);
        assert.equal(freshness.requiresFreshTestResources, requiresFreshTestResources);
        assert.equal(freshness.TEST_REQUIRE_FRESH_RESOURCES_ENV, TEST_REQUIRE_FRESH_RESOURCES_ENV);
        assert.equal(usesStrictGeneration(ordinaryEnv), false);
        assert.equal(usesStrictGeneration(strictEnv), true);
        for (const value of ['', 'false', 'TRUE', SECRET]) {
          assert.throws(
            () =>
              requiresFreshTestResources({
                ...ordinaryEnv,
                [TEST_REQUIRE_FRESH_RESOURCES_ENV]: value,
              }),
            /Invalid strict/,
          );
          assert.throws(
            () =>
              usesStrictGeneration({ ...ordinaryEnv, [TEST_REQUIRE_FRESH_RESOURCES_ENV]: value }),
            error => assertSafe(error, 'arguments'),
          );
        }
        const poisoned = strictGenerationFailure('operation', privateError());
        Object.assign(poisoned, {
          message: SECRET,
          stack: SECRET,
          stage: SECRET,
          cause: privateError(),
          private: SECRET,
        });
        const safe = strictGenerationFailure('run', poisoned);
        assert.notEqual(safe, poisoned);
        assertSafe(safe, 'operation');
        assertSafe(strictGenerationFailure('cleanup', privateError()), 'cleanup');
        reportIsolatedDiagnostic(true, 'cleanup-warning', privateError());
        assert.deepEqual(diagnostics, [['Strict contract generation: cleanup-warning']]);
        assertPrivate();
        const ordinary = privateError();
        reportIsolatedDiagnostic(false, 'ignored', ordinary);
        assert.equal(diagnostics[1][0], ordinary);
      });

      await t.test(
        'freshness APIs reject existing namespaces and sanitize fake driver failures',
        async () => {
          process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
          const app = () =>
            ({
              meta: { env: { VONA_TEST_RUN_ID: 'synthetic' }, appReady: false },
              projectPath: '/synthetic',
              config: {
                database: { base: {}, clients: { main: {} } },
                redis: { base: {}, clients: { main: {} } },
              },
            }) as any;
          for (const failure of ['local', 'database', 'redis', 'driver']) {
            reset();
            if (failure === 'local') state.localEntries.push('retained');
            const target = app();
            const readers = {
              databaseExists: async () => {
                state.calls.push('database-read');
                if (failure === 'driver') throw privateError();
                return failure === 'database';
              },
              redisExists: async () => {
                state.calls.push('redis-read');
                return failure === 'redis';
              },
            };
            assert.throws(
              () => freshness.assertFreshTestResourcesReady(target),
              /was not established/,
            );
            await assert.rejects(freshness.assertFreshTestResources(target, readers), error => {
              assert.ok(error instanceof Error);
              assert.ok(!inspect(error, { showHidden: true }).includes(SECRET));
              assert.equal(Object.hasOwn(error, 'cause'), false);
              return true;
            });
            assert.throws(
              () => freshness.assertFreshTestResourcesReady(target),
              /was not established/,
            );
            assert.ok(!state.calls.includes('cleanup'));
            if (failure === 'local') assert.ok(!state.calls.includes('database-read'));
            if (failure === 'database') assert.ok(!state.calls.includes('redis-read'));
          }
          reset();
          const target = app();
          const readers = { databaseExists: async () => false, redisExists: async () => false };
          await freshness.assertFreshTestResources(target, readers);
          freshness.assertFreshTestResourcesReady(target);
          await assert.rejects(
            freshness.assertFreshTestResources(target, readers),
            /new isolated startup/,
          );
          const readyApp = app();
          readyApp.meta.appReady = true;
          await assert.rejects(
            freshness.assertFreshTestResources(readyApp, readers),
            /new isolated startup/,
          );
          delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
          reset();
          await freshness.assertFreshTestResources(app(), {
            databaseExists: async () => {
              throw new Error('ordinary lane must not discover resources');
            },
            redisExists: async () => {
              throw new Error('ordinary lane must not discover resources');
            },
          });
          freshness.assertFreshTestResourcesReady(app());
          assert.deepEqual(state.calls, []);
        },
      );

      await t.test('explicit POSIX stdio and non-buffering native discard streams', async () => {
        assert.deepEqual(guardianStdio(true), ['ignore', 'ignore', 'ignore', 'ipc']);
        assert.deepEqual(guardianStdio(false), ['inherit', 'inherit', 'inherit', 'ipc']);
        const output = discardNativeOutput();
        assert.notEqual(output.stdout, output.stderr);
        let callbacks = 0;
        for (const sink of [output.stdout, output.stderr]) {
          sink.write(Buffer.from(SECRET), () => {
            callbacks++;
          });
          sink.write(Buffer.alloc(1024 * 1024, 120), () => {
            callbacks++;
          });
          assert.equal(sink.writableLength, 0);
          assert.deepEqual(sink.writableBuffer, []);
          sink.end();
          await finished(sink);
        }
        assert.equal(callbacks, 4);
      });

      await t.test(
        'real Vona lifecycle categorizes startup, operation, shutdown and combined failures',
        async () => {
          for (const scenario of [
            'success',
            'start',
            'ready',
            'operation',
            'stop',
            'combined',
            'interrupt',
          ]) {
            reset();
            const f = lifecycle({
              start: scenario === 'start',
              ready: scenario === 'ready',
              stop: ['stop', 'combined', 'interrupt'].includes(scenario),
            });
            const before = ['SIGINT', 'SIGTERM'].map(signal => process.listenerCount(signal));
            const run = runner.withIsolatedVona(
              47123,
              strictEnv,
              async () => {
                f.calls.push('operation');
                if (['operation', 'combined'].includes(scenario)) throw privateError();
                if (scenario === 'interrupt') {
                  process.emit('SIGINT');
                  await nextTurn();
                }
                return 'generated';
              },
              f.dependencies,
            );
            if (scenario === 'success') {
              assert.equal(await run, 'generated');
            } else {
              const stage = ['start', 'ready'].includes(scenario)
                ? 'startup'
                : scenario === 'combined'
                  ? 'operation-and-shutdown'
                  : scenario === 'operation'
                    ? 'operation'
                    : 'shutdown';
              await assert.rejects(run, error => assertSafe(error, stage));
            }
            assert.deepEqual(
              ['SIGINT', 'SIGTERM'].map(signal => process.listenerCount(signal)),
              before,
            );
            if (scenario === 'start') {
              assert.deepEqual(f.calls, ['start']);
            } else if (scenario === 'ready') {
              assert.deepEqual(f.calls, ['start', 'ready', 'stop']);
            } else {
              assert.equal(
                f.calls.filter(call => call === 'stop').length,
                scenario === 'interrupt' ? 2 : 1,
              );
            }
            if (scenario === 'interrupt') {
              assert.deepEqual(diagnostics, [
                ['Strict contract generation: interrupt-stop-failed'],
              ]);
            }
            assertPrivate();
          }
          const f = lifecycle();
          const ordinary = privateError();
          await assert.rejects(
            runner.withIsolatedVona(
              47123,
              ordinaryEnv,
              async () => {
                throw ordinary;
              },
              f.dependencies,
            ),
            error => error === ordinary,
          );
        },
      );

      await t.test(
        'real isolated run owns synthetic roots, retains failed status and never cleans failed operations',
        async () => {
          for (const scenario of ['operation', 'status', 'close']) {
            reset();
            state.statusThrows = scenario === 'status';
            state.brokerCloseThrows = scenario === 'close';
            await assert.rejects(
              runner.withIsolatedRun(
                'contract',
                async context => {
                  assert.equal(context.env.META_MODE, 'test');
                  assert.equal(context.env.VONA_TEST_REQUIRE_FRESH_RESOURCES, 'true');
                  assert.equal(context.env.SERVER_LISTEN_PORT, '47123');
                  assert.equal(context.env.VONA_TEST_CLAIM_TOKEN, SECRET);
                  assert.equal(state.writes.length, 2);
                  for (const write of state.writes) {
                    assert.equal(write.value, `${context.runId}\n`);
                    assert.deepEqual(write.options, { flag: 'wx' });
                  }
                  throw privateError();
                },
                '/synthetic',
                { skipExpiredClaimReaping: true },
              ),
              error => assertSafe(error, scenario === 'close' ? 'preparation' : 'run'),
            );
            assert.equal(state.directories.size, 3);
            assert.deepEqual(state.updates, [
              { type: 'local', kind: 'data', stage: 'owned' },
              { type: 'local', kind: 'generated', stage: 'owned' },
              { type: 'status', status: 'running' },
              { type: 'status', status: 'failed' },
            ]);
            assert.ok(!state.calls.includes('reap'));
            assert.ok(!state.calls.includes('cleanup'));
            assert.ok(state.calls.includes('broker-close'));
            assert.ok(
              diagnostics.some(
                values => values[0] === 'Strict contract generation: failed-resources-retained',
              ),
            );
            assertPrivate();
          }
        },
      );

      await t.test(
        'cleanup failures remain failures, discard warnings, and success alone reaches cleanup',
        async () => {
          for (const scenario of ['success', 'incomplete', 'throws']) {
            reset();
            state.cleanupWarn = scenario !== 'success';
            state.cleanupStatus = scenario === 'incomplete' ? 'retained' : 'cleaned';
            state.cleanupThrows = scenario === 'throws';
            const run = runner.withIsolatedRun('contract', async () => 'done', '/synthetic', {
              skipExpiredClaimReaping: true,
            });
            if (scenario === 'success') assert.equal(await run, 'done');
            else await assert.rejects(run, error => assertSafe(error, 'cleanup'));
            assert.equal(state.calls.filter(call => call === 'cleanup').length, 1);
            assert.ok(state.calls.indexOf('broker-close') < state.calls.indexOf('cleanup'));
            assert.ok(!state.updates.some(event => event.status === 'failed'));
            if (scenario !== 'success') {
              assert.ok(
                diagnostics.some(
                  values => values[0] === 'Strict contract generation: cleanup-warning',
                ),
              );
            }
            assertPrivate();
          }
          reset();
          process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
          await runner.withIsolatedRun(
            'contract',
            async ({ env }) => {
              assert.equal(
                env.VONA_TEST_REQUIRE_FRESH_RESOURCES,
                undefined,
                'ordinary runner clears inherited activation',
              );
            },
            '/synthetic',
          );
          assert.ok(state.calls.includes('reap'));
          assert.ok(state.calls.includes('cleanup'));
          delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
          reset();
          await assert.rejects(
            runner.withIsolatedRun('unit', async () => assert.fail('must not run'), '/synthetic', {
              skipExpiredClaimReaping: true,
            }),
            error => assertSafe(error, 'preparation'),
          );
          assert.deepEqual(state.calls, []);
        },
      );

      await t.test(
        'real POSIX owner waits for both durable ACKs and preserves IPC, identity and drainage',
        async () => {
          reset();
          const pending = deferred<void>();
          const registered = deferred<void>();
          state.pendingAck = pending.promise;
          state.registeredAck = registered.promise;
          const env = { ...strictEnv, VONA_TEST_CLAIM_TOKEN: SECRET };
          const starting = runner.startOwnedProcess(
            'synthetic-command',
            ['synthetic-argument'],
            '/synthetic',
            env,
          );
          await nextTurn();
          assert.equal(state.launches.length, 0, 'pending ACK must precede spawn');
          pending.resolve();
          await nextTurn();
          assert.equal(state.launches.length, 1);
          const child = state.guardians[0];
          assert.equal(child.messages.length, 0, 'registered ACK must precede start authorization');
          registered.resolve();
          const owner = await starting;
          assert.deepEqual(state.launches[0].options.stdio, ['ignore', 'ignore', 'ignore', 'ipc']);
          assert.equal(state.launches[0].options.detached, true);
          assert.equal(state.launches[0].options.env, env);
          assert.equal(child.startMessage.command, 'synthetic-command');
          assert.deepEqual(child.startMessage.args, ['synthetic-argument']);
          assert.equal(child.startMessage.env, env);
          assert.equal(child.startMessage.identity.pgid, child.pid);
          assert.deepEqual(
            state.claimEvents.map(event => event.process.stage),
            ['pending', 'registered'],
          );
          assert.ok(
            state.claimEvents.every(event => !inspect(event).includes(SECRET)),
            'claim records must not serialize environment',
          );
          let settled = false;
          const completion = owner.wait().then(result => {
            settled = true;
            return result;
          });
          child.emit('message', drained);
          await nextTurn();
          assert.equal(settled, false, 'drained IPC alone does not prove successful guardian exit');
          child.complete(drained);
          assert.deepEqual(await completion, drained);
          assert.deepEqual(await owner.stop(), drained);
          reset();
          const unproved = await runner.startOwnedProcess('synthetic', [], '/synthetic', strictEnv);
          const rejection = assert.rejects(
            unproved.wait(),
            /without proving process-tree shutdown/,
          );
          state.guardians[0].complete();
          await rejection;
          reset();
          const ordinary = await runner.startOwnedProcess(
            'synthetic',
            [],
            '/synthetic',
            ordinaryEnv,
          );
          assert.deepEqual(state.launches[0].options.stdio, [
            'inherit',
            'inherit',
            'inherit',
            'ipc',
          ]);
          await ordinary.stop();
          reset();
          await assert.rejects(
            runner.startOwnedProcess('synthetic', [], '/synthetic', {
              ...ordinaryEnv,
              VONA_TEST_REQUIRE_FRESH_RESOURCES: SECRET,
            }),
            error => assertSafe(error, 'arguments'),
          );
          assert.deepEqual(state.calls, []);
          assert.deepEqual(state.claimEvents, []);
        },
      );

      await t.test(
        'mocked Windows owner receives discard sinks without changing wait or stop proof',
        async () => {
          Object.defineProperty(process, 'platform', { ...originalPlatform, value: 'win32' });
          try {
            for (const strict of [true, false]) {
              reset();
              const completion = deferred<GuardianResult>();
              const native: OwnedProcess = {
                wait: () => completion.promise,
                stop: () => completion.promise,
              };
              state.nativeResult = native;
              const owner = await runner.startOwnedProcess(
                'synthetic',
                [],
                '/synthetic',
                strict ? strictEnv : ordinaryEnv,
              );
              assert.equal(owner, native);
              assert.equal(owner.wait(), completion.promise);
              assert.equal(owner.stop(), completion.promise);
              if (strict) {
                assert.ok(state.nativeOutput);
                for (const sink of [state.nativeOutput.stdout, state.nativeOutput.stderr]) {
                  await new Promise<void>((resolvePromise, reject) =>
                    sink.write(SECRET, error => (error ? reject(error) : resolvePromise())),
                  );
                  assert.equal(sink.writableLength, 0);
                  assert.deepEqual(sink.writableBuffer, []);
                  sink.end();
                  await finished(sink);
                }
              } else {
                assert.equal(state.nativeOutput, undefined);
              }
              completion.resolve(drained);
              assert.equal(await owner.wait(), drained);
              assert.deepEqual(state.launches, []);
            }
          } finally {
            Object.defineProperty(process, 'platform', { ...originalPlatform, value: 'darwin' });
          }
        },
      );

      await t.test(
        'real generator process fails safely on nonzero exit and asynchronous interrupt-stop rejection',
        async () => {
          for (const interrupted of [false, true]) {
            reset();
            state.generatorCompletes = !interrupted;
            state.generatorResult = {
              type: 'drained',
              failed: true,
              result: { code: 7, signal: null },
            };
            const before = process.listenerCount('SIGTERM');
            const run = runner.runIsolatedProcess(
              'synthetic',
              [':openapi:generate'],
              '/synthetic',
              strictEnv,
            );
            const rejection = assert.rejects(run, error => assertSafe(error, 'generator'));
            if (interrupted) {
              await nextTurn();
              const child = state.guardians[0];
              child.send = message => {
                child.messages.push(message);
                if (message.type === 'stop') child.complete();
                return true;
              };
              process.emit('SIGTERM');
            }
            await rejection;
            await nextTurn();
            assert.equal(process.listenerCount('SIGTERM'), before);
            if (interrupted) {
              assert.deepEqual(diagnostics, [
                ['Strict contract generation: interrupt-stop-failed'],
              ]);
            }
            assertPrivate();
          }
        },
      );

      await t.test(
        'public strict contract command drives both real orchestration children with no source fallback or leakage',
        async () => {
          installFetch();
          for (const mode of [
            'ok',
            'request-error',
            'json-error',
            'http-error',
            'shape-error',
            'generator-error',
          ]) {
            reset();
            state.fetchMode = mode;
            if (mode === 'generator-error') {
              state.generatorResult = {
                type: 'drained',
                failed: true,
                result: { code: 19, signal: null },
              };
            }
            const run = generator.generateOpenapiIsolated([
              'synthetic-module',
              '--skip-expired-claim-reaping',
              '--nometadata',
            ]);
            if (mode === 'ok') {
              await run;
            } else {
              await assert.rejects(run, error =>
                assertSafe(error, mode === 'generator-error' ? 'generator' : 'operation'),
              );
            }
            assert.deepEqual(
              state.fetches.map(request => request.source),
              ['http://127.0.0.1:47123/health/ready', SOURCE],
            );
            assert.equal(state.fetches[1].options?.redirect, 'error');
            const children = state.guardians.map(child => child.startMessage);
            const expectedChildren = ['ok', 'generator-error'].includes(mode) ? 2 : 1;
            assert.equal(children.length, expectedChildren);
            for (const launch of state.launches)
              assert.deepEqual(launch.options.stdio, ['ignore', 'ignore', 'ignore', 'ipc']);
            for (const child of children) {
              assert.equal(child.env.VONA_TEST_REQUIRE_FRESH_RESOURCES, 'true');
              assert.equal(child.env.META_MODE, 'test');
              assert.equal(child.env.VONA_TEST_CLAIM_TOKEN, SECRET);
            }
            assert.ok(children[0].args.includes(':bin:dev'));
            assert.ok(children[0].env.VONA_TEST_READY_KEY);
            if (expectedChildren === 2) {
              assert.ok(children[1].args.includes(':openapi:generate'));
              assert.equal(children[1].env.OPENAPI_SOURCE_URL, SOURCE);
              assert.equal(children[1].env.VONA_TEST_READY_KEY, undefined);
              assert.ok(!children[1].args.includes('--skip-expired-claim-reaping'));
              assert.ok(children[1].args.includes('--nometadata'));
            }
            assert.ok(state.guardians[0].messages.some(message => message.type === 'stop'));
            assert.equal(state.calls.includes('cleanup'), mode === 'ok');
            assert.ok(!state.calls.includes('reap'));
            assertPrivate();
          }
          for (const args of [
            ['--skip-expired-claim-reaping=true'],
            ['--skip-expired-claim-reaping', `--projectPath=${SECRET}`],
          ]) {
            reset();
            await assert.rejects(generator.generateOpenapiIsolated(args), error =>
              assertSafe(error, 'run'),
            );
            assert.deepEqual(state.calls, []);
            assert.deepEqual(state.fetches, []);
          }
          reset();
          process.env.E2E_BASE_URL = SECRET;
          await assert.rejects(
            generator.generateOpenapiIsolated(['--skip-expired-claim-reaping']),
            error => assertSafe(error, 'run'),
          );
          assert.deepEqual(state.calls, []);
          assertPrivate();
        },
      );
    } finally {
      console.error = originalConsole;
      globalThis.fetch = originalFetch;
      Object.defineProperty(process, 'platform', originalPlatform);
      for (const [key, value] of savedEnv) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      if (previousGlobal) Object.defineProperty(globalThis, globalKey, previousGlobal);
      else Reflect.deleteProperty(globals, globalKey);
    }
  },
);
