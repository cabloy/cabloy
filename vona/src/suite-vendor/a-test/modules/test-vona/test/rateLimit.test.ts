import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const RateLimitPath = '/test/vona/performAction/rateLimit' as any;

describe('rateLimit.test.ts', { concurrency: false }, () => {
  it('action:rateLimit:disabled', async () => {
    await app.bean.executor.mockCtx(async () => {
      const result = await app.bean.executor.performAction('get', RateLimitPath, {
        innerAccess: false,
        onions: {
          interceptor: {
            'a-ratelimit:rateLimit': { mode: 'disabled' },
          },
        },
      });
      assert.equal(result, 'allowed');
    });
  });

  it('action:rateLimit:enforce', async () => {
    const redis = app.bean.redis;
    const get = redis.get.bind(redis);
    let requests = 0;
    (redis as any).get = (clientName: string) => {
      if (clientName !== 'limiter') return get(clientName as any);
      return {
        async eval() {
          requests++;
          return [requests, 60_000];
        },
      };
    };
    try {
      await app.bean.executor.mockCtx(async () => {
        const first = await app.bean.executor.performAction('get', RateLimitPath, {
          innerAccess: false,
        });
        const second = await app.bean.executor.performAction('get', RateLimitPath, {
          innerAccess: false,
        });
        assert.equal(first, 'allowed');
        assert.equal(second, 'allowed');
        const [_, error] = await catchError(() => {
          return app.bean.executor.performAction('get', RateLimitPath, {
            innerAccess: false,
          });
        });
        assert.equal(error?.code, 429);
      });
    } finally {
      (redis as any).get = get;
    }
  });
});
