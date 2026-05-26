import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('modelRelationsJoins.test.ts', () => {
  it('action:modelRelationsJoins', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = 'action:modelRelationsJoins';
      // scope
      const scopeTest = app.scope('test-vona');
      // test data: create
      const testData = await scopeTest.service.testData.create(prefix);
      const { userTom, userJimmy } = testData;
      // joins: auto
      const itemsJoins = await scopeTest.model.post.select({
        joins: [['innerJoin', 'testVonaUser', ['testVonaPost.userId', 'testVonaUser.id']]],
        where: {
          'testVonaUser.id': userTom.id,
        },
        orders: [['testVonaUser.id', 'asc']],
      });
      assert.equal(itemsJoins.length, 2);
      // joins: manual
      const itemsJoins2 = await scopeTest.model.post.select(
        {
          joins: [['innerJoin', 'testVonaUser', ['testVonaPost.userId', 'testVonaUser.id']]],
          where: {
            'testVonaUser.id': userJimmy.id,
          },
          orders: [['testVonaUser.id', 'asc']],
        },
        {},
        ['test-vona:user'],
      );
      assert.equal(itemsJoins2.length, 0);
      // joins: manual: no table prefix
      const itemsJoins3 = await scopeTest.model.post.select(
        {
          columns: ['id', 'title'],
          joins: [['innerJoin', 'testVonaUser', ['userId', 'testVonaUser.id']]],
          where: {
            'testVonaUser.id': userJimmy.id,
            'userId': userJimmy.id,
          },
          orders: [
            ['testVonaUser.id', 'asc'],
            ['testVonaPost.createdAt', 'asc'],
          ],
        },
        {},
        ['test-vona:user'],
      );
      assert.equal(itemsJoins3.length, 0);
      // test data: delete
      await scopeTest.service.testData.drop(testData);
    });
  });
});
