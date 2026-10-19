import knex from 'knex';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { ServiceTransactionFiber } from 'vona-module-a-orm';

describe('transaction.test.ts', { concurrency: false }, () => {
  const tableNameFail = '__tempTransactionFail';
  const tableNameSuccess = '__tempTransactionSuccess';
  const tableNameCommit = '__tempTransactionCommit';

  it('keeps independent contexts out of a sibling transaction, including captured queries', async () => {
    await app.bean.executor.mockCtx(async () => {
      const entered = Promise.withResolvers<void>();
      const release = Promise.withResolvers<void>();
      const captured = Promise.withResolvers<void>();
      const committed = Promise.withResolvers<void>();
      let readerInTransaction: boolean | undefined;
      const writer = app.bean.executor.mockCtx(async () => {
        await app.bean.database.current.transaction.begin(async () => {
          entered.resolve();
          await release.promise;
        });
      });
      void writer.catch(entered.reject);
      let reader: Promise<unknown> | undefined;
      try {
        await entered.promise;
        reader = app.bean.executor.mockCtx(async () => {
          const db = app.bean.database.current;
          readerInTransaction = db.inTransaction;
          const query = db.connection.raw('select 1 as value');
          captured.resolve();
          await committed.promise;
          return await query;
        });
        void reader.catch(captured.reject);
        await captured.promise;
        release.resolve();
        await writer;
        committed.resolve();
        await reader;
        assert.equal(readerInTransaction, false);
        assert.equal(app.bean.database.current.inTransaction, false);
      } finally {
        release.resolve();
        committed.resolve();
        await Promise.allSettled([writer, ...(reader ? [reader] : [])]);
      }
    });
  });

  it('preserves REQUIRED propagation only for delegated contexts', async () => {
    await app.bean.executor.mockCtx(async () => {
      const db = app.bean.database.current;
      await db.transaction.begin(async () => {
        const connection = db.connection;
        await db.transaction.begin(async () => {
          assert.equal(db.connection, connection);
        });
        await app.bean.executor.newCtx(async () => {
          assert.equal(app.bean.database.current.connection, connection);
          await app.bean.database.current.transaction.begin(async () => {
            assert.equal(app.bean.database.current.connection, connection);
          });
        });
        await app.bean.executor.mockCtx(async () => {
          assert.equal(app.bean.database.current.inTransaction, false);
          assert.notEqual(app.bean.database.current.connection, connection);
        });
        await app.bean.executor.newCtxIsolate(async () => {
          assert.equal(app.bean.database.current.inTransaction, false);
          assert.notEqual(app.bean.database.current.connection, connection);
        });
        assert.equal(db.connection, connection);
      });
      assert.equal(db.inTransaction, false);
    });
  });

  it('preserves SUPPORTS, MANDATORY, and NEVER propagation', async () => {
    await app.bean.executor.mockCtx(async () => {
      const db = app.bean.database.current;
      await db.transaction.begin(
        async () => {
          assert.equal(db.inTransaction, false);
        },
        { propagation: 'SUPPORTS' },
      );
      await db.transaction.begin(
        async () => {
          assert.equal(db.inTransaction, false);
        },
        { propagation: 'NEVER' },
      );
      await assert.rejects(
        db.transaction.begin(async () => {}, { propagation: 'MANDATORY' }),
        {
          message: 'transaction error: EnumTransactionPropagation.MANDATORY',
        },
      );
      await db.transaction.begin(async () => {
        const connection = db.connection;
        for (const propagation of ['SUPPORTS', 'MANDATORY'] as const) {
          await db.transaction.begin(
            async () => {
              assert.equal(app.bean.database.current.connection, connection);
            },
            { propagation },
          );
        }
        await assert.rejects(
          db.transaction.begin(async () => {}, { propagation: 'NEVER' }),
          {
            message: 'transaction error: EnumTransactionPropagation.NEVER',
          },
        );
      });
      assert.equal(db.inTransaction, false);
    });
  });

  it('restores the caller transaction after datasource isolation', async t => {
    await app.bean.executor.mockCtx(async () => {
      const db = app.bean.database.current;
      if (!db.dialect.capabilities.level) {
        t.skip('requires independent datasource levels');
        return;
      }
      await db.transaction.begin(async () => {
        const connection = db.connection;
        await db.transaction.begin(
          async () => {
            assert.equal(app.bean.database.current.inTransaction, false);
            assert.notEqual(app.bean.database.current.connection, connection);
            await app.bean.database.current.connection.raw('select 1 as value');
          },
          { propagation: 'NOT_SUPPORTED' },
        );
        assert.equal(app.bean.database.current.connection, connection);
        await db.transaction.begin(
          async () => {
            const isolatedConnection = app.bean.database.current.connection;
            assert.equal(app.bean.database.current.inTransaction, true);
            assert.notEqual(isolatedConnection, connection);
            await app.bean.executor.newCtx(async () => {
              assert.equal(app.bean.database.current.connection, isolatedConnection);
              await app.bean.database.current.connection.raw('select 1 as value');
            });
          },
          { propagation: 'REQUIRES_NEW' },
        );
        assert.equal(app.bean.database.current.connection, connection);
        await connection.raw('select 1 as value');
      });
      assert.equal(db.inTransaction, false);
    });
  });

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
