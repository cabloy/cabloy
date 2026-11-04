import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('modelMagic.test.ts', { concurrency: false }, () => {
  it('action:modelMagic', async () => {
    await app.bean.executor.mockCtx(async () => {
      const name = `modelMagic:${randomUUID()}`;
      const scopeTest = app.scope('test-vona');
      try {
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
        // omitted eq => null
        const usersNullByMagic = await scopeTest.model.user.selectByName(undefined, {
          columns: ['id'],
          orders: [['id', 'asc']],
        });
        const usersNullByWhere = await scopeTest.model.user.select({
          columns: ['id'],
          orders: [['id', 'asc']],
          where: { name: null },
        });
        assert.deepEqual(usersNullByMagic, usersNullByWhere);
        // omitted non-eq => throw
        await assert.rejects(async () => {
          await scopeTest.model.user.getByNameEqI(undefined);
        });
        // updateById
        await scopeTest.model.user.updateById(item.id, { age: 18 });
        user = await scopeTest.model.user.getById(item.id);
        assert.equal(user?.age, 18);
        await scopeTest.model.user.updateById(item.id, { age: undefined });
        user = await scopeTest.model.user.getById(item.id);
        assert.equal(user?.age, null);
        // deleteById
        await scopeTest.model.user.deleteById(item.id);
      } finally {
        await scopeTest.model.user.delete({ name });
      }
    });
  });

  it('matches literal names case-insensitively without treating them as patterns', async () => {
    await app.bean.executor.mockCtx(async () => {
      const model = app.scope('test-vona').model.user;
      const prefix = `modelMagic:${randomUUID()}:`;
      const cases = [
        ['MixedCase', 'MixedCaseExtra'],
        ['Rate%', 'RateExtra'],
        ['Under_score', 'UnderXscore'],
        ['Bang!', 'Bang'],
        ["Slash\\'Quote", "Slash'Quote"],
      ];
      const names = cases.flat().map(suffix => `${prefix}${suffix}`);
      try {
        await model.insertBulk(names.map(name => ({ name })));
        for (const [suffix] of cases) {
          const name = `${prefix}${suffix}`;
          const user = await model.getByNameEqI(name.toUpperCase());
          assert.equal(user?.name, name);
          const users = await model.selectByNameEqI(name.toUpperCase());
          assert.deepEqual(
            users.map(item => item.name),
            [name],
          );
        }
      } finally {
        await model.delete({ name: names });
      }
    });
  });
});
