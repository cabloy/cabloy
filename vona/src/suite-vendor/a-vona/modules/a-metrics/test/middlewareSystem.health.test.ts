import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import ts from 'typescript';

const healthUrl = new URL('../src/bean/middlewareSystem.health.ts?fixture=health', import.meta.url)
  .href;
const identityUrl = new URL(
  '../../../../../../packages-vona/vona-core/src/lib/core/testIsolation.ts',
  import.meta.url,
).href;
let closes = 0;
const closeKey = Symbol.for('vona.health.test.close');
(globalThis as Record<symbol, unknown>)[closeKey] = () => closes++;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === healthUrl) {
      const source = {
        'vona': `export class BeanBase {} export { assertTestAppIdentity } from ${JSON.stringify(identityUrl)}; export function closeProcessWorker() { globalThis[Symbol.for('vona.health.test.close')](); }`,
        'vona-module-a-aspect': 'export function MiddlewareSystem() { return () => {}; }',
      }[specifier];
      if (source)
        return { url: `data:text/javascript,${encodeURIComponent(source)}`, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === healthUrl) {
      return {
        format: 'module',
        source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
          compilerOptions: {
            experimentalDecorators: true,
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
const { MiddlewareSystemHealth } = await import(healthUrl);
hooks.deregister();

const runId = '20261014010203-a1b2c3d4';
const key = 'a'.repeat(64);
const nonce = 'b'.repeat(32);
const payload = `${runId}\nPOST\n/health/test-stop\n${nonce}`;
const sign = (value: string) => createHmac('sha256', key).update(value).digest('hex');

function fixture() {
  const req = { socket: { remoteAddress: '127.0.0.1' }, url: '/health/test-stop' };
  const headers: Record<string, string> = {
    'x-vona-test-stop-nonce': nonce,
    'x-vona-test-stop-authorization': sign(`vona-test-stop-request-v1\n${payload}`),
  };
  const responseHeaders: Record<string, string> = {};
  const ctx = {
    path: '/health/test-stop',
    method: 'POST',
    req,
    res: new EventEmitter(),
    status: 0,
    type: '',
    body: undefined as unknown,
    get: (name: string) => headers[name] ?? '',
    set: (name: string, value: string) => (responseHeaders[name] = value),
  };
  const app = {
    name: `cabtest${runId}`,
    meta: { env: { META_MODE: 'test', VONA_TEST_RUN_ID: runId } },
    config: { server: { workers: 1 } },
  };
  let nexts = 0;
  const healthCalls: string[] = [];
  const middleware = Object.create(MiddlewareSystemHealth.prototype);
  Object.assign(middleware, {
    app,
    ctx,
    $scope: {
      metrics: {
        service: {
          health: {
            async status(path: string) {
              healthCalls.push(path);
              return { code: 200, status: 'ok' };
            },
          },
        },
      },
    },
  });
  return {
    app,
    ctx,
    headers,
    responseHeaders,
    healthCalls,
    execute: () =>
      middleware.execute({}, async () => {
        nexts++;
      }),
    nexts: () => nexts,
  };
}

function withServerEnv(callback: () => Promise<void>) {
  const names = ['META_MODE', 'VONA_TEST_RUN_ID', 'VONA_TEST_READY_KEY'] as const;
  const old = names.map(name => process.env[name]);
  process.env.META_MODE = 'test';
  process.env.VONA_TEST_RUN_ID = runId;
  process.env.VONA_TEST_READY_KEY = key;
  return callback().finally(() => {
    for (const [index, name] of names.entries()) {
      if (old[index] === undefined) delete process.env[name];
      else process.env[name] = old[index];
    }
  });
}

describe('authenticated managed shutdown', { concurrency: false }, () => {
  test('shutdown acknowledges its distinct domain before close and rejects replay across middleware instances', async () => {
    await withServerEnv(async () => {
      const f = fixture();
      const before = closes;
      await f.execute();
      assert.equal(f.ctx.status, 200);
      assert.deepEqual(f.ctx.body, { status: 'stopping' });
      assert.equal(
        f.responseHeaders['x-vona-test-stop-proof'],
        sign(`vona-test-stop-ack-v1\n${payload}`),
      );
      assert.equal(closes, before);
      const replay = fixture();
      replay.app = f.app;
      // A separate request-scoped middleware with the same application must reject.
      const middleware = Object.create(MiddlewareSystemHealth.prototype);
      Object.assign(middleware, { app: f.app, ctx: replay.ctx });
      await middleware.execute({}, async () => assert.fail('not next'));
      assert.equal(replay.ctx.status, 409);
      f.ctx.res.emit('finish');
      f.ctx.res.emit('finish');
      assert.equal(closes, before + 1);
      assert.deepEqual(f.healthCalls, []);
    });
  });

  const invalidCases: [string, (f: ReturnType<typeof fixture>) => void, number][] = [
    [
      'ordinary mode',
      f => {
        f.app.meta.env.META_MODE = 'dev';
      },
      404,
    ],
    [
      'missing identity',
      f => {
        f.app.meta.env.VONA_TEST_RUN_ID = '';
      },
      404,
    ],
    [
      'invalid date',
      f => {
        f.app.meta.env.VONA_TEST_RUN_ID = '20269999010203-a1b2c3d4';
      },
      404,
    ],
    [
      'wrong app identity',
      f => {
        f.app.name = 'ordinary-app';
      },
      404,
    ],
    [
      'multiple workers',
      f => {
        f.app.config.server.workers = 2;
      },
      404,
    ],
    [
      'non-loopback socket ignoring forwarded IP',
      f => {
        f.ctx.req.socket.remoteAddress = '192.0.2.1';
        f.headers['x-forwarded-for'] = '127.0.0.1';
      },
      404,
    ],
    [
      'wrong method',
      f => {
        f.ctx.method = 'GET';
      },
      403,
    ],
    [
      'query path',
      f => {
        f.ctx.req.url += '?ignored=yes';
      },
      403,
    ],
    [
      'missing nonce',
      f => {
        delete f.headers['x-vona-test-stop-nonce'];
      },
      403,
    ],
    [
      'malformed authorization',
      f => {
        f.headers['x-vona-test-stop-authorization'] = 'short';
      },
      403,
    ],
    [
      'bad signature',
      f => {
        f.headers['x-vona-test-stop-authorization'] = 'f'.repeat(64);
      },
      403,
    ],
    [
      'readiness signature cannot stop',
      f => {
        f.headers['x-vona-test-stop-authorization'] = sign(nonce);
      },
      403,
    ],
    [
      'ack signature cannot stop',
      f => {
        f.headers['x-vona-test-stop-authorization'] = sign(`vona-test-stop-ack-v1\n${payload}`);
      },
      403,
    ],
    [
      'wrong run signature',
      f => {
        f.headers['x-vona-test-stop-authorization'] = sign(
          `vona-test-stop-request-v1\n${payload.replace(runId, '20261014010203-d4e5f6a7')}`,
        );
      },
      403,
    ],
    [
      'different nonce',
      f => {
        f.headers['x-vona-test-stop-nonce'] = 'c'.repeat(32);
      },
      403,
    ],
  ];
  for (const [name, change, status] of invalidCases) {
    test(`shutdown rejects ${name} without initiating close`, async () => {
      await withServerEnv(async () => {
        const f = fixture();
        const before = closes;
        change(f);
        await f.execute();
        assert.equal(f.ctx.status, status);
        assert.equal(f.ctx.res.listenerCount('finish'), 0);
        f.ctx.res.emit('finish');
        assert.equal(closes, before);
        assert.deepEqual(f.responseHeaders, {});
      });
    });
  }

  for (const [name, value] of [
    ['META_MODE', 'dev'],
    ['VONA_TEST_RUN_ID', '20261014010203-d4e5f6a7'],
    ['VONA_TEST_READY_KEY', 'not-a-key'],
  ] as const) {
    test(`shutdown requires matching server-only ${name}`, async () => {
      await withServerEnv(async () => {
        const f = fixture();
        process.env[name] = value;
        await f.execute();
        assert.equal(f.ctx.status, 404);
        assert.equal(f.ctx.res.listenerCount('finish'), 0);
      });
    });
  }

  test('existing readiness signing and unrelated health routes remain unchanged', async () => {
    await withServerEnv(async () => {
      const f = fixture();
      f.ctx.path = '/health/ready';
      f.headers['x-vona-test-challenge'] = nonce;
      await f.execute();
      assert.equal(f.responseHeaders['x-vona-test-proof'], sign(nonce));
      assert.deepEqual(f.healthCalls, ['/health/ready']);
      assert.equal(f.ctx.res.listenerCount('finish'), 0);
      f.ctx.path = '/unrelated';
      await f.execute();
      assert.equal(f.nexts(), 1);
    });
  });
});
