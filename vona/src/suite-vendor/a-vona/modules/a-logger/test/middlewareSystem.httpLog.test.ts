import type { Socket } from 'node:net';
import type { VonaContext } from 'vona';

import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { EventEmitter, once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createServer, get, request } from 'node:http';
import { createRequire, registerHooks } from 'node:module';
import { PassThrough } from 'node:stream';
import { describe, test } from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
// Koa belongs to core; use that installed dependency, not a new test dependency.
const Koa = createRequire(require.resolve('vona-core/package.json'))('koa');
const middlewareUrl = new URL(
  '../src/bean/middlewareSystem.httpLog.ts?fixture=httpLog',
  import.meta.url,
).href;
const boundaryFixture = `data:text/javascript,${encodeURIComponent(`
  export class BeanBase {}
  let boundary;
  export function getRequestBoundary() { return boundary; }
  export function setBoundary(value) { boundary = value; }
`)}`;
const { setBoundary } = await import(boundaryFixture);
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === middlewareUrl) {
      if (specifier === 'vona') return { url: boundaryFixture, shortCircuit: true };
      if (specifier === 'vona-module-a-aspect') {
        return {
          url: `data:text/javascript,${encodeURIComponent('export function MiddlewareSystem() { return () => {}; }')}`,
          shortCircuit: true,
        };
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === middlewareUrl) {
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
const { MiddlewareSystemHttpLog } = await import(middlewareUrl);
hooks.deregister();

interface AccessRecord {
  method: string;
  url: string;
  statusCode: number | null;
  durationMs: number;
  outcome: 'finished' | 'aborted';
}

function assertRecord(record: AccessRecord, statusCode: number | null, outcome = 'finished') {
  assert.deepEqual(Object.keys(record).sort(), [
    'durationMs',
    'method',
    'outcome',
    'statusCode',
    'url',
  ]);
  assert.equal(record.method, 'GET');
  assert.equal(record.statusCode, statusCode);
  assert.equal(record.outcome, outcome);
  assert.equal(Number.isFinite(record.durationMs), true);
  assert.ok(record.durationMs >= 0);
}

async function serve(next: (ctx: VonaContext) => Promise<unknown>) {
  const app = new Koa();
  const logs: AccessRecord[] = [];
  const errors: Error[] = [];
  const published = Promise.withResolvers<void>();
  const settled = Promise.withResolvers<void>();
  app.on('error', (error: Error) => errors.push(error));
  app.use(async (ctx: VonaContext) => {
    const middleware = Object.create(MiddlewareSystemHttpLog.prototype);
    Object.assign(middleware, {
      ctx,
      $loggerChild: (name: string, client: string) => {
        assert.equal(name, 'res');
        assert.equal(client, 'access');
        return {
          info(message: () => string) {
            logs.push(JSON.parse(message()));
            published.resolve();
          },
        };
      },
    });
    try {
      return await middleware.execute({}, () => next(ctx));
    } finally {
      settled.resolve();
    }
  });
  const server = createServer(app.callback());
  const sockets = new Set<Socket>();
  server.on('connection', socket => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
  });
  const close = async () => {
    const closed = new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
    for (const socket of sockets) socket.destroy();
    await closed;
  };
  try {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    return {
      port: address.port,
      logs,
      errors,
      published: published.promise,
      settled: settled.promise,
      close,
    };
  } catch (error) {
    for (const socket of sockets) socket.destroy();
    server.close();
    throw error;
  }
}

function fetchResponse(port: number) {
  const completed = Promise.withResolvers<{ statusCode: number | undefined; body: string }>();
  const req = get({ hostname: '127.0.0.1', port, path: '/lifecycle', agent: false }, res => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', chunk => (body += chunk));
    res.on('error', completed.reject);
    res.on('end', () => completed.resolve({ statusCode: res.statusCode, body }));
  });
  req.on('error', completed.reject);
  return { req, completed: completed.promise };
}

describe('HTTP logger', { concurrency: false }, () => {
  test('HTTP logger skips context and diagnostic access inside a request boundary', async () => {
    const middleware = Object.create(MiddlewareSystemHttpLog.prototype);
    for (const key of ['app', 'ctx', '$loggerChild']) {
      Object.defineProperty(middleware, key, {
        get() {
          assert.fail('protected diagnostic access');
        },
      });
    }
    let calls = 0;
    setBoundary({ diagnostics: 'suppress' });
    try {
      assert.equal(
        await middleware.execute({}, async () => {
          calls++;
          return 23;
        }),
        23,
      );
      assert.equal(calls, 1);
    } finally {
      setBoundary(undefined);
    }
  });

  for (const path of ['/health/ready', '/health/test-stop']) {
    test(`HTTP logger never logs headers at ${path} and leaves originals unchanged`, async () => {
      const headers = {
        'x-vona-test-challenge': 'secret-challenge',
        'X-Vona-Test-Stop-Authorization': 'secret-authorization',
        'x-vona-test-stop-nonce': 'secret-nonce',
        'accept': 'application/json',
      };
      const responseHeaders = {
        'x-vona-test-proof': 'secret-readiness',
        'X-Vona-Test-Stop-Proof': 'secret-ack',
        'content-type': 'application/json',
      };
      const originalHeaders = structuredClone(headers);
      const originalResponseHeaders = structuredClone(responseHeaders);
      const logs: AccessRecord[] = [];
      const res = Object.assign(new EventEmitter(), {
        statusCode: 200,
        writableFinished: false,
        getHeaders: () => responseHeaders,
      });
      const middleware = Object.create(MiddlewareSystemHttpLog.prototype);
      Object.assign(middleware, {
        ctx: {
          path,
          state: {},
          req: { method: 'GET', url: `${path}?token=secret-query`, headers },
          res,
        },
        $loggerChild: (_name: string, client: string) => {
          assert.equal(client, 'access');
          return { info: (message: () => string) => logs.push(JSON.parse(message())) };
        },
      });
      await middleware.execute({}, async () => {});
      assert.equal(logs.length, 0);
      res.writableFinished = true;
      res.emit('finish');
      res.emit('close');
      assert.equal(logs.length, 1);
      assertRecord(logs[0], 200);
      assert.equal(logs[0].url, `${path}?[REDACTED]`);
      assert.equal(JSON.stringify(logs).includes('secret-'), false);
      assert.equal(JSON.stringify(logs).includes('application/json'), false);
      assert.deepEqual(headers, originalHeaders);
      assert.deepEqual(responseHeaders, originalResponseHeaders);
    });
  }

  test(
    'stream completion outlives middleware settlement and publishes once',
    { timeout: 5000 },
    async () => {
      const stream = new PassThrough();
      const fixture = await serve(async ctx => {
        ctx.status = 206;
        ctx.body = stream;
      });
      const client = fetchResponse(fixture.port);
      try {
        await fixture.settled;
        assert.equal(fixture.logs.length, 0);
        stream.end('streamed body');
        assert.deepEqual(await client.completed, { statusCode: 206, body: 'streamed body' });
        await fixture.published;
        assert.equal(fixture.logs.length, 1);
        assertRecord(fixture.logs[0], 206);
      } finally {
        stream.destroy();
        client.req.destroy();
        await fixture.close();
      }
    },
  );

  test(
    'Koa maps a rejected next to its final response status before publication',
    { timeout: 5000 },
    async () => {
      const failure = Object.assign(new Error('mapped failure'), { status: 422, expose: true });
      const fixture = await serve(async () => {
        throw failure;
      });
      const client = fetchResponse(fixture.port);
      try {
        assert.deepEqual(await client.completed, { statusCode: 422, body: 'mapped failure' });
        await fixture.published;
        assert.deepEqual(fixture.errors, [failure]);
        assert.equal(fixture.logs.length, 1);
        assertRecord(fixture.logs[0], 422);
      } finally {
        client.req.destroy();
        await fixture.close();
      }
    },
  );

  test(
    'client abort publishes status null while next is still pending',
    { timeout: 5000 },
    async () => {
      const entered = Promise.withResolvers<void>();
      const release = Promise.withResolvers<void>();
      let nextSettled = false;
      const fixture = await serve(async ctx => {
        entered.resolve();
        await release.promise;
        nextSettled = true;
        ctx.body = 'too late';
      });
      const client = request({ hostname: '127.0.0.1', port: fixture.port, agent: false });
      client.on('error', () => {}); // Destroying this request intentionally resets its socket.
      try {
        client.end();
        await entered.promise;
        assert.equal(fixture.logs.length, 0);
        client.destroy();
        // Publication must not wait for the blocked downstream middleware.
        await fixture.published;
        assert.equal(nextSettled, false);
        assert.equal(fixture.logs.length, 1);
        assertRecord(fixture.logs[0], null, 'aborted');
        release.resolve();
        await fixture.settled;
        assert.equal(fixture.logs.length, 1);
      } finally {
        release.resolve();
        client.destroy();
        await fixture.close();
      }
    },
  );

  test('SSR res.end publishes finish before next settles', { timeout: 5000 }, async () => {
    const release = Promise.withResolvers<void>();
    let nextSettled = false;
    const fixture = await serve(async ctx => {
      ctx.respond = false;
      ctx.res.statusCode = 201;
      ctx.res.end('SSR response');
      await release.promise;
      nextSettled = true;
    });
    const client = fetchResponse(fixture.port);
    try {
      assert.deepEqual(await client.completed, { statusCode: 201, body: 'SSR response' });
      await fixture.published;
      assert.equal(nextSettled, false);
      assert.equal(fixture.logs.length, 1);
      assertRecord(fixture.logs[0], 201);
      release.resolve();
      await fixture.settled;
      assert.equal(fixture.logs.length, 1);
    } finally {
      release.resolve();
      client.req.destroy();
      await fixture.close();
    }
  });

  test('late events retain registration ALS, honor invoking boundaries and contain logger errors', async () => {
    const storage = new AsyncLocalStorage<{ requestId: string }>();
    const registration = { requestId: 'registered-request' };
    const invoking = { requestId: 'unrelated-event-source' };
    const observed: unknown[] = [];
    const logs: AccessRecord[] = [];
    let contextReads = 0;
    let failLogger = false;
    const register = async () => {
      // The emitter is deliberately created outside the registration ALS scope.
      const res = Object.assign(new EventEmitter(), { statusCode: 200, writableFinished: false });
      const ctx = { state: {}, req: { method: 'GET', url: '/late' }, res };
      const middleware = Object.create(MiddlewareSystemHttpLog.prototype);
      for (const key of ['app', 'bean']) {
        Object.defineProperty(middleware, key, {
          get() {
            assert.fail('late logging must not recreate an owned context scope');
          },
        });
      }
      Object.defineProperty(middleware, 'ctx', {
        get() {
          assert.equal(storage.getStore(), registration);
          contextReads++;
          return ctx;
        },
      });
      middleware.$loggerChild = () => ({
        info(message: () => string) {
          observed.push(storage.getStore());
          logs.push(JSON.parse(message()));
          if (failLogger) throw new Error('diagnostic sink failure');
        },
      });
      assert.equal(
        await storage.run(registration, () => middleware.execute({}, async () => 23)),
        23,
      );
      return res;
    };
    try {
      const protectedResponse = await register();
      storage.run(invoking, () => {
        setBoundary({ diagnostics: 'suppress' });
        try {
          protectedResponse.emit('finish');
        } finally {
          setBoundary(undefined);
        }
        protectedResponse.emit('close');
      });
      assert.equal(logs.length, 0);

      const response = await register();
      failLogger = true;
      assert.doesNotThrow(() =>
        storage.run(invoking, () => {
          response.emit('finish');
          response.emit('close');
        }),
      );
      assert.deepEqual(observed, [registration]);
      assert.equal(logs.length, 1);
      assertRecord(logs[0], 200);
      assert.equal(contextReads, 2);
      assert.equal(response.listenerCount('finish'), 0);
      assert.equal(response.listenerCount('close'), 0);
    } finally {
      setBoundary(undefined);
      storage.disable();
    }
  });
});
