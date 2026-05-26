import { catchError } from '@cabloy/utils';
import { DateTime } from 'luxon';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('database.test.ts', () => {
  it('action:database:switchClient', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeDatabase = app.scope('a-orm');
      const defaultClientName = scopeDatabase.service.database.getDefaultClientName();
      // current
      assert.equal(app.ctx.db.clientName, defaultClientName);
      // switch
      const clientNames = Object.keys(app.config.database.clients);
      const clientName2 = clientNames.find(item => item !== defaultClientName);
      await app.bean.database.switchDb(
        async () => {
          assert.equal(app.ctx.db.clientName, clientName2);
        },
        { clientName: clientName2 as any },
      );
      // restore
      assert.equal(app.ctx.db.clientName, defaultClientName);
    });
  });
  it('action:model:clientName', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      const modelTest = scopeTest.model.test;
      assert.equal(modelTest.options.client, 'default');
      const modelTest2 = scopeTest.model.test;
      assert.equal(modelTest, modelTest2);
    });
  });
  it('action:model:clientNameDynamic:transaction:fail', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      const entityTest = await scopeTest.model.test.insert({ title: 'clientNameDynamic:fail' });
      assert.equal(entityTest.title, 'clientNameDynamic:fail');
      await catchError(async () => {
        const db = app.bean.database.getDb({ clientName: 'default' });
        await db.transaction.begin(async () => {
          const modelTest = scopeTest.model.test.newInstance(db);
          assert.equal(modelTest.options.client, 'default');
          await modelTest.update({ id: entityTest.id, title: 'clientNameDynamic:fail_1' });
          throw new Error('rollback');
        });
      });
      const entityTest2 = await scopeTest.model.test.get({ id: entityTest.id });
      assert.equal(entityTest2?.title, 'clientNameDynamic:fail');
      // delete
      await scopeTest.model.test.delete({ id: entityTest.id });
    });
  });
  it('action:model:clientNameDynamic:transaction:success', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      const entityTest = await scopeTest.model.test.insert({ title: 'clientNameDynamic:success' });
      assert.equal(entityTest.title, 'clientNameDynamic:success');
      const db = app.bean.database.getDb({ clientName: 'default' });
      await db.transaction.begin(async () => {
        const modelTest = scopeTest.model.test.newInstance(db);
        assert.equal(modelTest.options.client, 'default');
        await modelTest.update({ id: entityTest.id, title: 'clientNameDynamic:success_1' });
      });
      const entityTest2 = await scopeTest.model.test.get({ id: entityTest.id });
      assert.equal(entityTest2?.title, 'clientNameDynamic:success_1');
      // delete
      await scopeTest.model.test.delete({ id: entityTest.id });
    });
  });
  it('action:database:transaction:compensate', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      const entityTest = await scopeTest.model.test.insert({
        title: 'transaction:compensate:fail',
      });
      assert.equal(entityTest.title, 'transaction:compensate:fail');
      await catchError(async () => {
        const db = app.bean.database.getDb({ clientName: 'default' });
        await db.transaction.begin(async () => {
          const modelTest = scopeTest.model.test.newInstance(db);
          assert.equal(modelTest.options.client, 'default');
          await modelTest.update({ id: entityTest.id, title: 'transaction:compensate:fail_1' });
          // let cache take effect
          await modelTest.get({ id: entityTest.id });
          throw new Error('rollback');
        });
      });
      const entityTest2 = await scopeTest.model.test.get({ id: entityTest.id });
      assert.equal(entityTest2?.title, 'transaction:compensate:fail');
      // delete
      await scopeTest.model.test.delete({ id: entityTest.id });
    });
  });
  it('action:model:dynamicTableName', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      const entityTest = scopeTest.entity.test;
      const modelTest = scopeTest.model.testDynamicTable;
      // tableName
      const tableName = `${entityTest.$table}_${DateTime.now().toFormat('yyyyMMdd')}`;
      // create table
      await app.bean.model.createTable(tableName, table => {
        table.basicFields();
        table.string(entityTest.title, 255);
        table.string(entityTest.description, 255);
      });
      // insert
      const item = await modelTest.insert({ title: 'title', description: 'description' });
      // get
      const item2 = await modelTest.get({ id: item.id });
      assert.equal(item2?.id, item.id);
      // get by tableName
      const item3 = await app.bean.model.get(tableName as any, { id: item.id });
      assert.equal(item3.id, item.id);
      // delete
      await modelTest.delete({ id: item.id });
      // get by tableName
      const item4 = await app.bean.model.get(tableName as any, { id: item.id });
      assert.equal(item4, undefined);
      // drop table
      await app.bean.model.dropTable(tableName);
    });
  });
});
