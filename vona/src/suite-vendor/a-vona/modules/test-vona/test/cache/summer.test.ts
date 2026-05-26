import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('summer.test.ts', () => {
  it('action:summer', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('post', '/test/vona/summer');
    });
  });
});
