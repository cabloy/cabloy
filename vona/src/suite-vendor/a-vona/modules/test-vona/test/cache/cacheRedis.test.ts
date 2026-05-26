import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('cacheRedis.test.ts', () => {
  it('action:cacheRedis', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('post', '/test/vona/cacheRedis');
    });
  });
});
