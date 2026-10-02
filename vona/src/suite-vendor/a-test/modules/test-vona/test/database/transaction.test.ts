import knex from 'knex';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { ServiceTransactionFiber } from 'vona-module-a-orm';

describe('transaction.test.ts', { concurrency: false }, () => {
  const tableNameFail = '__tempTransactionFail';
  const tableNameSuccess = '__tempTransactionSuccess';
  const tableNameCommit = '__tempTransactionCommit';

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

  it('action:transaction:commit', async () => {
    const scopeTest = app.scope('test-vona');
    await app.bean.executor.mockCtx(async () => {
      await app.bean.model.createTable(tableNameCommit, table => {
        table.basicFields();
        table.string('name');
      });
      try {
        let callbackCalled = false;
        await scopeTest.service.transaction.commit(async () => {
          await new Promise<void>(resolve => setImmediate(resolve));
          assert.equal(app.bean.database.current.inTransaction, false);
          const item = await app.bean.model.get(tableNameCommit as any, { name: 'transaction' });
          assert.equal(item.name, 'transaction');
          await app.bean.model.insert(tableNameCommit as any, { name: 'commit' });
          callbackCalled = true;
        });
        assert.equal(callbackCalled, true);
        const items = await app.bean.model.select(tableNameCommit as any, {});
        assert.equal(items.length, 2);
      } finally {
        await app.bean.model.dropTable(tableNameCommit);
      }
    });
  });

  it('propagates an actual deferred-constraint failure at COMMIT', async () => {
    await app.bean.executor.mockCtx(async () => {
      const db = knex({
        client: 'better-sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      });
      try {
        await db.raw('PRAGMA foreign_keys = ON');
        await db.raw('CREATE TABLE commitParent (id integer PRIMARY KEY)');
        await db.raw(
          'CREATE TABLE commitChild (parentId integer REFERENCES commitParent(id) DEFERRABLE INITIALLY DEFERRED)',
        );
        const transaction = await db.transaction();
        const fiber = app.bean._newBean(ServiceTransactionFiber, transaction);
        let successCallbackCalled = false;
        fiber.commit(() => {
          successCallbackCalled = true;
        });
        await transaction.raw('INSERT INTO commitChild (parentId) VALUES (1)');
        await assert.rejects(fiber.doCommit(), { code: 'SQLITE_CONSTRAINT_FOREIGNKEY' });
        assert.equal(successCallbackCalled, false);
      } finally {
        await db.destroy();
      }
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
