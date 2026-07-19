import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('modelForUpdate.test.ts', () => {
  it('action:modelForUpdate', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      const modelTest = scopeTest.model.test;
      const entityTest = await modelTest.insert({ title: 'action:modelForUpdate' });
      try {
        await assert.rejects(async () => {
          await modelTest.getForUpdate({ id: entityTest.id });
        }, /getForUpdate requires an active transaction/);
        await assert.rejects(async () => {
          await modelTest.getByIdForUpdate(entityTest.id);
        }, /getForUpdate requires an active transaction/);

        await app.ctx.db.transaction.begin(async () => {
          const byTitle = await modelTest.getForUpdate({ title: entityTest.title });
          assert.equal(byTitle?.id, entityTest.id);
          const byId = await modelTest.getByIdForUpdate(entityTest.id, { columns: ['id'] });
          assert.deepEqual(byId, { id: entityTest.id });
          const missing = await modelTest.getByIdForUpdate(-1);
          assert.equal(missing, undefined);
        });

        await modelTest.delete({ id: entityTest.id });
        await app.ctx.db.transaction.begin(async () => {
          const deleted = await modelTest.getByIdForUpdate(entityTest.id);
          assert.equal(deleted, undefined);
        });
      } finally {
        await modelTest.delete({ id: entityTest.id }, { disableDeleted: true });
      }
    });
  });

  it('action:modelForUpdate:relations', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      const testData = await scopeTest.service.testData.create('action:modelForUpdate');
      try {
        await app.ctx.db.transaction.begin(async () => {
          const post = await scopeTest.model.post.getByIdForUpdate(testData.postApple.id, {
            columns: 'id',
            include: { postContent: true },
          });
          assert.equal(post?.postContent?.content, 'action:modelForUpdate:postContentApple');
        });
      } finally {
        await scopeTest.service.testData.drop(testData);
      }
    });
  });

  it('action:modelForUpdate:cache', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      const modelTest = scopeTest.model.test;
      const entityTest = await modelTest.insert({ title: 'action:modelForUpdate:cache' });
      try {
        await modelTest.getById(entityTest.id);
        await modelTest.builder().where('id', entityTest.id).update({ title: 'updated' });
        await app.ctx.db.transaction.begin(async () => {
          const locked = await modelTest.getByIdForUpdate(entityTest.id);
          assert.equal(locked?.title, 'updated');
        });
      } finally {
        await modelTest.delete({ id: entityTest.id }, { disableDeleted: true });
      }
    });
  });
});
