import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const RateLimitPath = '/test/vona/performAction/rateLimit' as any;
const RateLimitControllerPath = '/test/vona/performAction/rateLimitController' as any;

function useLimiterCommand(command: () => Promise<[number, number]>) {
  const redis = app.bean.redis;
  const get = redis.get.bind(redis);
  (redis as any).get = (clientName: string) => {
    if (clientName !== 'limiter') return get(clientName as any);
    return { rateLimitAdmit: command };
  };
  return () => {
    (redis as any).get = get;
  };
}

describe('rateLimit.test.ts', { concurrency: false }, () => {
  it('action:rateLimit:disabled', async () => {
    await app.bean.executor.mockCtx(async () => {
      const result = await app.bean.executor.performAction('get', RateLimitPath, {
        innerAccess: false,
        onions: {
          interceptor: {
            'a-ratelimit:rateLimit': { enable: false },
          },
        },
      });
      assert.equal(result, 'allowed');
    });
  });

  it('controller:rateLimit:enforce', async () => {
    let requests = 0;
    const restore = useLimiterCommand(async () => {
      requests++;
      return [requests, 60_000];
    });
    try {
      await app.bean.executor.mockCtx(async () => {
        for (let index = 0; index < 3; index++) {
          const result = await app.bean.executor.performAction('get', RateLimitControllerPath, {
            innerAccess: false,
          });
          assert.equal(result, 'allowed-controller');
        }
        const [_, error] = await catchError(() => {
          return app.bean.executor.performAction('get', RateLimitControllerPath, {
            innerAccess: false,
          });
        });
        assert.equal(error?.code, 429);
      });
    } finally {
      restore();
    }
  });

  it('action:rateLimit:enforce', async () => {
    let requests = 0;
    const restore = useLimiterCommand(async () => {
      requests++;
      return [requests, 60_000];
    });
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
      restore();
    }
  });

  it('action:rateLimit:redisError:enforce', async () => {
    const restore = useLimiterCommand(async () => {
      throw new Error('redis unavailable');
    });
    try {
      await app.bean.executor.mockCtx(async () => {
        const [_, error] = await catchError(() => {
          return app.bean.executor.performAction('get', RateLimitPath, {
            innerAccess: false,
          });
        });
        assert.equal(error?.code, 503);
      });
    } finally {
      restore();
    }
  });

  it('action:rateLimit:redisError:observe', async () => {
    const restore = useLimiterCommand(async () => {
      throw new Error('redis unavailable');
    });
    try {
      await app.bean.executor.mockCtx(async () => {
        const result = await app.bean.executor.performAction('get', RateLimitPath, {
          innerAccess: false,
          onions: {
            interceptor: {
              'a-ratelimit:rateLimit': { rateLimit: { mode: 'observe' } },
            },
          },
        });
        assert.equal(result, 'allowed');
      });
    } finally {
      restore();
    }
  });
});
