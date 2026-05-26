import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('modelMagic.test.ts', () => {
  it('action:modelMagic', async () => {
    await app.bean.executor.mockCtx(async () => {
      const name = 'modelMagic:001';
      // scope
      const scopeTest = app.scope('test-vona');
      // create
      const item = await scopeTest.model.user.insert({ name });
      assert.equal(item.name, name);
      // getById
      let user = await scopeTest.model.user.getById(item.id);
      assert.equal(user?.name, name);
      // getByName
      user = await scopeTest.model.user.getByName(name);
      assert.equal(user?.name, name);
      user = await scopeTest.model.user.getByNameEqI(name.toUpperCase());
      assert.equal(user?.name, name);
      const users = await scopeTest.model.user.selectByName(name);
      assert.equal(users[0].name, name);
      const users2 = await scopeTest.model.user.selectByName(name, {
        where: { id: item.id },
        columns: ['age', 'name'],
      });
      assert.equal(users2[0].name, name);
      // updateById
      await scopeTest.model.user.updateById(item.id, { age: 18 });
      user = await scopeTest.model.user.getById(item.id);
      assert.equal(user?.age, 18);
      // deleteById
      await scopeTest.model.user.deleteById(item.id);
    });
  });
});
