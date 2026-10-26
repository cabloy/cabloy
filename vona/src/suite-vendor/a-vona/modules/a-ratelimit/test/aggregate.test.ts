import type { IMiddlewareSystemOptionsAggregate, RateLimitMode } from 'vona-module-a-ratelimit';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { describe, it } from 'node:test';
import { setTimeout } from 'node:timers/promises';
import { cast, compose } from 'vona';
import { app } from 'vona-mock';
import { MiddlewareSystemAggregate, ServiceRateLimit } from 'vona-module-a-ratelimit';

const exemptPath = '/api/test/vona/performAction/rateLimitExempt';
const limitedPath = '/api/test/vona/performAction/rateLimit';

type AdmitCommand = (key: string, windowMs: string) => Promise<[number, number]>;

function createService(command: AdmitCommand) {
  const service = app.bean._newBean(ServiceRateLimit);
  Object.defineProperty(service, 'bean', {
    value: { redis: { get: () => ({ rateLimitAdmit: command }) } },
  });
  return service;
}

type Request = (path: string, options?: RequestInit) => Promise<Response>;

async function withGate(
  mode: RateLimitMode,
  limit: number,
  command: AdmitCommand,
  fn: (request: Request) => Promise<void>,
) {
  await app.bean.executor.mockCtx(async () => {
    const middleware = app.bean._newBean(MiddlewareSystemAggregate);
    Object.defineProperty(middleware, 'scope', {
      value: { service: { rateLimit: createService(command) } },
    });
    const policyName = `test-aggregate-${randomUUID()}`;
    // Keep admission and its listener local; never patch the shared application chain.
    const chain = compose([
      (_ctx, next) => middleware.execute({ rateLimit: { mode, limit } }, next),
      ...app.middleware,
    ]);
    const server = createServer((req, res) => {
      void app.bean.executor
        .newCtx(
          () => {
            app.ctx.onionsDynamic = {
              interceptor: { 'a-ratelimit:rateLimit': { rateLimit: { name: policyName } } },
            };
            return cast(app).handleRequest(app.ctx, chain);
          },
          { dbInfo: { level: 0 }, innerAccess: false, req, res },
        )
        .catch(error => res.destroy(error));
    });
    try {
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const address = server.address();
      assert.ok(address && typeof address !== 'string');
      await fn((path, options) =>
        fetch(`http://127.0.0.1:${address.port}${path}`, {
          ...options,
          headers: { accept: 'application/json', ...options?.headers },
          signal: AbortSignal.timeout(10_000),
        }),
      );
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close(error => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      });
      const redis = app.bean.redis.get('limiter');
      const prefix = redis.options.keyPrefix ?? '';
      const keys = await redis.keys(`${prefix}rate-limit:v1:*:${encodeURIComponent(policyName)}:*`);
      if (keys.length) await redis.del(...keys.map(key => key.slice(prefix.length)));
    }
  });
}

function counter(): AdmitCommand {
  let current = 0;
  return async () => [++current, 1_000];
}

describe('aggregate.test.ts', { concurrency: false }, () => {
  it('shares an atomic Redis budget across request contexts and expires its counter', async () => {
    const key = `test:aggregate:${randomUUID()}`;
    const redis = cast(app.bean.redis.get('limiter'));
    const keys: string[] = [];
    // Isolate this test's bucket without changing the production key dimensions or TTL.
    const service = createService((actualKey, windowMs) => {
      keys.push(actualKey);
      return redis.rateLimitAdmit(key, windowMs);
    });
    try {
      const results = await Promise.all(
        [0, 1, 2, 3].map(index =>
          app.bean.executor.mockCtx(async () => {
            app.ctx.req.url = `/aggregate-${index}`;
            return service.admitAggregate({
              mode: 'enforce',
              limit: 2,
            });
          }),
        ),
      );
      assert.equal(results.filter(result => result.allowed).length, 2);
      assert.ok(keys.every(actualKey => /^rate-limit:aggregate:v1:\d+$/.test(actualKey)));
      assert.equal(await redis.get(key), '4');
      const ttl = await redis.pttl(key);
      assert.ok(ttl > 0 && ttl <= 1_000);
      await setTimeout(ttl + 20);
      assert.equal(await redis.get(key), null);
      await app.bean.executor.mockCtx(async () => {
        const result = await service.admitAggregate({
          mode: 'enforce',
          limit: 2,
        });
        assert.equal(result.allowed, true);
        assert.equal(result.remaining, 1);
      });
    } finally {
      await redis.del(key);
    }
  });

  it('counts health, preflight, unknown paths and identity-exempt actions in one HTTP budget', async () => {
    await withGate('enforce', 3, counter(), async request => {
      const health = await request('/health/live');
      assert.equal(health.status, 200);
      await health.text();
      const preflight = await request('/aggregate-unknown', {
        method: 'OPTIONS',
        headers: { 'origin': 'https://example.test', 'access-control-request-method': 'GET' },
      });
      assert.notEqual(preflight.status, 429);
      await preflight.text();
      const unknown = await request(`/aggregate-unknown-${randomUUID()}`);
      assert.equal(unknown.status, 404);
      await unknown.text();
      const rejected = await request(exemptPath);
      assert.equal(rejected.status, 429);
      assert.equal(rejected.headers.get('retry-after'), '1');
      assert.equal(rejected.headers.get('ratelimit-limit'), null);
      assert.deepEqual(await rejected.json(), { code: 429, message: 'Too Many Requests' });
    });
  });

  it('observes excess requests without rejecting or replacing identity headers', async () => {
    await withGate('observe', 1, counter(), async request => {
      for (let index = 0; index < 2; index++) {
        const response = await request(exemptPath);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('ratelimit-limit'), null);
        assert.equal(response.headers.get('retry-after'), null);
        await response.text();
      }
    });
    await withGate('enforce', 100, counter(), async request => {
      for (let index = 0; index < 2; index++) {
        const response = await request(limitedPath);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('ratelimit-limit'), '2');
        await response.text();
      }
      const response = await request(limitedPath);
      assert.equal(response.status, 429);
      assert.equal(response.headers.get('ratelimit-limit'), '2');
      await response.text();
    });
  });

  it('fails open only in observe mode and preserves HTTP 503 for HTML callers', async () => {
    const unavailable: AdmitCommand = async () => {
      throw new Error('redis unavailable');
    };
    await withGate('observe', 1, unavailable, async request => {
      const response = await request('/health/live');
      assert.equal(response.status, 200);
      await response.text();
    });
    await withGate('enforce', 1, unavailable, async request => {
      const response = await request(exemptPath, { headers: { accept: 'text/html' } });
      assert.equal(response.status, 503);
      assert.match(response.headers.get('content-type')!, /application\/json/);
      assert.equal(response.headers.get('retry-after'), null);
      assert.deepEqual(await response.json(), { code: 503, message: 'Service Unavailable' });
    });
  });

  it('keeps competing gates and the shared application listener independent', async () => {
    await Promise.all([
      withGate(
        'enforce',
        1,
        async () => [2, 1_000],
        async request => {
          const response = await request('/health/live');
          assert.equal(response.status, 429);
          await response.text();
          const address = app.server.address();
          assert.ok(address && typeof address !== 'string');
          const shared = await fetch(`http://127.0.0.1:${address.port}/health/live`, {
            signal: AbortSignal.timeout(10_000),
          });
          assert.equal(shared.status, 200);
          await shared.text();
        },
      ),
      withGate(
        'enforce',
        1,
        async () => [1, 1_000],
        async request => {
          const response = await request('/health/live');
          assert.equal(response.status, 200);
          await response.text();
        },
      ),
    ]);
  });

  it('requires valid explicit configuration even in observe mode', async () => {
    await app.bean.executor.mockCtx(async () => {
      const middleware = app.bean._newBean(MiddlewareSystemAggregate);
      let downstream = false;
      const next = async () => {
        downstream = true;
      };
      for (const options of [
        {},
        { rateLimit: { mode: 'observe', limit: 0 } },
        { rateLimit: { mode: 'observe', limit: 1.5 } },
        { rateLimit: { mode: 'invalid', limit: 1 } },
      ]) {
        await assert.rejects(
          middleware.execute(options as IMiddlewareSystemOptionsAggregate, next),
          /rate-limit aggregate/,
        );
      }
      assert.equal(downstream, false);
    });
  });
});
