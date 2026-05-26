import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('cacheMem.test.ts', () => {
  it('action:cacheMem', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('post', '/test/vona/cacheMem');
    });
  });
});
