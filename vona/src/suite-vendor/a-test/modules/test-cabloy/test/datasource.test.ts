import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { cast } from 'vona';
import { app } from 'vona-mock';

describe('datasource.test.ts', () => {
  it('action:datasource', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      // insert
      const entityTest = await scopeTest.model.test.insert({ title: 'datasource:compensate:fail' });
      assert.equal(entityTest.title, 'datasource:compensate:fail');
      // scope
      const clientConfig = app
        .scope('a-orm')
        .service.database.getClientConfig(app.ctx.db.clientName);
      const clientConfig2 = app.ctx.db.client.clientConfig;
      const clientConfig3 = app.bean.database.current.client.clientConfig;
      assert.equal(clientConfig.client, clientConfig2.client);
      assert.equal(clientConfig.client, clientConfig3.client);
      const entityDatasource = await app.bean.datasource.create({
        name: '__datasource_test',
        config: clientConfig3,
      });
      const db = await app.bean.datasource.getDb(entityDatasource);
      await catchError(async () => {
        await db.transaction.begin(async () => {
          const modelTest = scopeTest.model.test.newInstance(db);
          assert.equal(cast(modelTest).db, db);
          await modelTest.update({ id: entityTest.id, title: 'datasource:compensate:fail_1' });
          // let cache take effect
          await modelTest.get({ id: entityTest.id });
          throw new Error('rollback');
        });
      });
      const entityTest2 = await scopeTest.model.test.get({ id: entityTest.id });
      assert.equal(entityTest2?.title, 'datasource:compensate:fail');
      // update client
      await app.bean.datasource.update(entityDatasource);
      const modelTest = scopeTest.model.test.newInstance(db);
      const entityTest3 = await modelTest.get({ id: entityTest.id });
      assert.equal(entityTest3?.title, 'datasource:compensate:fail');
      // delete
      await scopeTest.model.test.delete({ id: entityTest.id });
      // remove datasource
      await app.bean.datasource.remove(entityDatasource.id);
    });
  });
});
