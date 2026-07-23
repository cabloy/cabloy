import { compose } from '@cabloy/compose';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('retryable.test.ts', { concurrency: false }, () => {
  it('keeps ordinary next one-shot while replaying only the suffix', async () => {
    let outer = 0;
    let inner = 0;
    let target = 0;
    const chain = compose([
      async (_context, next) => {
        outer++;
        await next.replay();
        return await next.replay();
      },
      async (_context, next) => {
        inner++;
        return await next();
      },
    ]);
    await chain(undefined, async () => {
      target++;
    });
    assert.equal(outer, 1);
    assert.equal(inner, 2);
    assert.equal(target, 2);

    const doubleNext = compose([
      async (_context, next) => {
        await next();
        return await next();
      },
    ]);
    await assert.rejects(
      doubleNext(undefined, async () => {}),
      /next\(\) called multiple times/,
    );
  });

  it('retries only explicitly allowed error codes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const retryable = app.scope('test-vona').service.retryable;
      const key = `core-${randomUUID()}`;
      assert.equal(await retryable.core(key, 2), 3);
      assert.equal(retryable.attempts(key), 3);

      const nonRetryableKey = `non-retryable-${randomUUID()}`;
      await assert.rejects(retryable.core(nonRetryableKey, 1, 'NOT_RETRYABLE'), {
        code: 'NOT_RETRYABLE',
      });
      assert.equal(retryable.attempts(nonRetryableKey), 1);
    });
  });

  it('supports direct AOP use and disabled retry', async () => {
    await app.bean.executor.mockCtx(async () => {
      const retryable = app.scope('test-vona').service.retryable;
      const directKey = `direct-${randomUUID()}`;
      assert.equal(await retryable.direct(directKey, 1), 2);
      assert.equal(retryable.attempts(directKey), 2);

      const disabledKey = `disabled-${randomUUID()}`;
      await assert.rejects(retryable.disabled(disabledKey, 1), { code: 'RETRYABLE' });
      assert.equal(retryable.attempts(disabledKey), 1);
    });
  });

  it('replays the downstream transaction in a fresh attempt', async () => {
    await app.bean.executor.mockCtx(async () => {
      const retryable = app.scope('test-vona').service.retryable;
      const tableName = `__tempRetryable${randomUUID().replaceAll('-', '')}`;
      const key = `transaction-${randomUUID()}`;
      try {
        await app.bean.model.createTable(tableName, table => {
          table.basicFields();
          table.string('name');
        });
        assert.equal(await retryable.transaction(tableName, key, 1), 2);
        assert.equal(retryable.attempts(key), 2);
        const items = await app.bean.model.select(tableName as any, {
          orders: [['id', 'asc']],
        });
        assert.deepEqual(
          items.map(item => item.name),
          [`${key}-2`],
        );
      } finally {
        await app.bean.model.dropTable(tableName);
      }
    });
  });

  it('retries owner-only operations only when they own the transaction', async () => {
    await app.bean.executor.mockCtx(async () => {
      const retryable = app.scope('test-vona').service.retryable;
      const tableName = `__tempOwnerOnlyRetryable${randomUUID().replaceAll('-', '')}`;
      const standaloneKey = `standalone-${randomUUID()}`;
      const nestedKey = `nested-${randomUUID()}`;
      try {
        await app.bean.model.createTable(tableName, table => {
          table.basicFields();
          table.string('name');
        });
        assert.equal(await retryable.ownerOnlyTransaction(tableName, standaloneKey, 1), 2);
        assert.equal(retryable.attempts(standaloneKey), 2);
        await assert.rejects(
          app.bean.database.current.transaction.begin(
            () => retryable.ownerOnlyTransaction(tableName, nestedKey, 1),
            { isolationLevel: 'SERIALIZABLE' },
          ),
          { code: 'RETRYABLE' },
        );
        assert.equal(retryable.attempts(nestedKey), 1);
        const items = await app.bean.model.select(tableName as any, {
          orders: [['id', 'asc']],
        });
        assert.deepEqual(
          items.map(item => item.name),
          [`${standaloneKey}-2`],
        );
      } finally {
        await app.bean.model.dropTable(tableName);
      }
    });
  });
});
