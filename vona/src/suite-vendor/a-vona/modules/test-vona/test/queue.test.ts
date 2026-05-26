import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('queue.test.ts', () => {
  it('action:queue', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('post', '/test/vona/queue/push');
      await app.bean.executor.performAction('post', '/test/vona/queue/pushAsync');
    });
  });
});
