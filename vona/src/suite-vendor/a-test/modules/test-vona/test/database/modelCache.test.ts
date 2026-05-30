import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('modelCache.test.ts', () => {
  it('action:modelCache:cacheQuery', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelCache:cacheQuery';
      // scope
      const scopeTest = app.scope('test-vona');
      // create
      const user = await scopeTest.model.user.insert({ name: `${prefix}:1` });
      // select
      let items = await scopeTest.model.user.select({ where: { name: `${prefix}:1` } });
      assert.equal(items.length, 1);
      // select again
      items = await scopeTest.model.user.select({ where: { name: `${prefix}:1` } });
      assert.equal(items.length, 1);
      // get
      const user2 = await scopeTest.model.user.get({ id: user.id });
      const user3 = await scopeTest.model.user.get({ name: `${prefix}:1` });
      const user4 = await scopeTest.model.user.get({ name: `${prefix}:1` });
      assert.equal(user2?.id, user3?.id);
      assert.equal(user3?.id, user4?.id);
      // update
      await scopeTest.model.user.update({ id: user.id, name: `${prefix}:2` });
      // select
      items = await scopeTest.model.user.select({ where: { name: `${prefix}:2` } });
      assert.equal(items.length, 1);
      // delete
      await scopeTest.model.user.delete({ name: `${prefix}:2` });
      // select
      items = await scopeTest.model.user.select({ where: { name: `${prefix}:2` } });
      assert.equal(items.length, 0);
    });
  });
});
