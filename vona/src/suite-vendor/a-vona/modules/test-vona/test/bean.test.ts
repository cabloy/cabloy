import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('bean.test.ts', () => {
  it('action:bean', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('get', '/test/vona/bean/test');
    });
  });

  it('action:service', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('get', '/test/vona/bean/service');
    });
  });
});
