import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('transaction.test.ts', () => {
  const tableNameFail = '__tempTransactionFail';
  const tableNameSuccess = '__tempTransactionSuccess';

  it('action:transaction:fail', async () => {
    // transaction
    await app.bean.executor.mockCtx(async () => {
      // create table
      await app.bean.model.createTable(tableNameFail, table => {
        table.basicFields();
        table.string('name');
      });
      // create a new item
      const res = await app.bean.model.insert(tableNameFail as any, {
        name: 'hello',
      });
      const id = res.id;

      // try to change name
      const itemNew = {
        id,
        name: 'hello!!',
      };
      try {
        await app.bean.executor.performAction('post', '/test/vona/transaction/fail', {
          body: itemNew,
        });
      } catch (_err) {}

      // check name
      const item = await app.bean.model.get(tableNameFail as any, {
        id,
      });
      assert.notEqual(item.name, itemNew.name);

      // drop table
      await app.bean.model.dropTable(tableNameFail);
    });

    // aop method
    const scopeTest = app.scope('test-vona');
    await app.bean.executor.mockCtx(async () => {
      // create table
      await app.bean.model.createTable(tableNameFail, table => {
        table.basicFields();
        table.string('name');
      });
      // create a new item
      const res = await app.bean.model.insert(tableNameFail as any, {
        name: 'hello',
      });
      const id = res.id;

      // try to change name
      const itemNew = {
        id,
        name: 'hello!!',
      };
      try {
        await scopeTest.service.transaction.fail(itemNew);
      } catch (_err) {}

      // check name
      const item = await app.bean.model.get(tableNameFail as any, {
        id,
      });
      assert.notEqual(item.name, itemNew.name);

      // drop table
      await app.bean.model.dropTable(tableNameFail);
    });
  });

  it('action:transaction:success', async () => {
    // transaction
    await app.bean.executor.mockCtx(async () => {
      // create table
      await app.bean.model.createTable(tableNameSuccess, table => {
        table.basicFields();
        table.string('name');
      });
      // create a new item
      const res = await app.bean.model.insert(tableNameSuccess as any, {
        name: 'hello',
      });
      const id = res.id;

      // try to change name
      const itemNew = {
        id,
        name: 'hello!!',
      };
      await app.bean.executor.performAction('post', '/test/vona/transaction/success', {
        body: itemNew,
      });

      // check name
      const item = await app.bean.model.get(tableNameSuccess as any, {
        id,
      });
      assert.equal(item.name, itemNew.name);

      // drop table
      await app.bean.model.dropTable(tableNameSuccess);
    });

    // aop method
    const scopeTest = app.scope('test-vona');
    await app.bean.executor.mockCtx(async () => {
      // create table
      await app.bean.model.createTable(tableNameSuccess, table => {
        table.basicFields();
        table.string('name');
      });
      // create a new item
      const res = await app.bean.model.insert(tableNameSuccess as any, {
        name: 'hello',
      });
      const id = res.id;

      // try to change name
      const itemNew = {
        id,
        name: 'hello!!',
      };
      await scopeTest.service.transaction.success(itemNew);

      // check name
      const item = await app.bean.model.get(tableNameSuccess as any, {
        id,
      });
      assert.equal(item.name, itemNew.name);

      // drop table
      await app.bean.model.dropTable(tableNameSuccess);
    });
  });
});
