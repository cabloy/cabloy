import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('seed.test.ts', () => {
  it('startup seeds test-mode baseline data', async () => {
    assert.equal(app.meta.isTest, true);

    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      const userKevin = await scopeTest.model.user.get({ name: 'Kevin' });
      const post = await scopeTest.model.post.get({ title: 'test:post001' });

      assert.ok(userKevin);
      assert.equal(post?.userId, userKevin.id);
    });
  });
});
