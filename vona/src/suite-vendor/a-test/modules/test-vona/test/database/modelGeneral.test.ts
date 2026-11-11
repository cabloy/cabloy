import { isNil } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('model.test.ts', { concurrency: false }, () => {
  it('logs model operation summaries without SQL or record values', async () => {
    await app.bean.executor.mockCtx(async () => {
      const context = app.ctx;
      const model = app.scope('test-vona').model.user;
      const secret = `model-diagnostic-private-canary-${randomUUID()}`;
      const updated = `${secret}-updated`;
      const messages: string[] = [];
      const logger = app.bean.logger.default;
      const observe = (info: { name?: string; message: string | (() => string) }) => {
        if (app.ctx !== context || info.name !== 'model') return;
        const message = typeof info.message === 'function' ? info.message() : info.message;
        if (message.includes('testVonaUser')) messages.push(message);
      };
      logger.on('data', observe);
      try {
        const user = await model.insert({ name: secret });
        const rows = await model.select({ where: { id: user.id } });
        assert.equal(rows[0]?.name, secret);
        assert.equal(await model.count({ where: { id: user.id } }), '1');
        await model.update({ id: user.id, name: updated });
        assert.equal((await model.get({ id: user.id }))?.name, updated);
        await model.delete({ id: user.id }, { disableDeleted: true });
        assert.equal(await model.get({ id: user.id }), undefined);
        for (const operation of ['insert', 'select', 'update', 'delete']) {
          assert.ok(messages.some(message => message.startsWith(`model.${operation}: `)));
        }
        assert.ok(messages.every(message => !message.includes(secret)));
        assert.ok(
          messages.every(message =>
            /^model\.(?:select|count|increment|insert|update|delete): testVonaUser(?:, rows=\d+)?$/.test(
              message,
            ),
          ),
        );
      } finally {
        try {
          await model.delete({ name: [secret, updated] }, { disableDeleted: true });
        } finally {
          logger.off('data', observe);
        }
      }
    });
  });
  it('action:model:defaultValue', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      // create
      const item = await scopeTest.model.test.insert();
      assert.equal(isNil(item.testDate), false);
      // delete
      await scopeTest.model.test.delete({ id: item.id });
    });
  });
});
