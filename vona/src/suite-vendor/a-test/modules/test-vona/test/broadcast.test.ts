import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('broadcast.test.ts', () => {
  it('action:broadcast', async () => {
    await app.bean.executor.mockCtx(async () => {
      app.scope('test-vona').broadcast.test.emit(
        { message: 'hello' },
        {
          locale: 'zh-cn',
        },
      );
      assert.equal(app.ctx.instanceName, '');
    });
  });
});
