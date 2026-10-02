import type { IMetaOptionsIndex } from 'vona-module-a-index';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { appResource } from 'vona';
import { app } from 'vona-mock';

const expectedIndexes = {
  commercePaymentAttempt: ['orderId', 'userId', 'state', 'correlationId'],
  commercePaymentAudit: ['paymentAttemptId', 'providerEventId', 'orderId', 'idempotencyKey'],
  commercePaymentRefundRequest: ['orderId', 'userId', 'state', 'correlationId'],
  commercePaymentRefundAttempt: ['refundRequestId', 'orderId', 'state'],
  commercePaymentRefundAudit: [
    'refundRequestId',
    'refundAttemptId',
    'orderId',
    'idempotencyKey',
    'correlationId',
  ],
};

describe('paymentIndexes.test.ts', { concurrency: false }, () => {
  it('registers all payment indexes without overwriting table keys', () => {
    const options = appResource.getBean('commerce-payment.meta.index')
      ?.options as IMetaOptionsIndex;
    assert.ok(options);
    assert.deepEqual(options.indexes, expectedIndexes);
  });

  it('creates non-unique single-column indexes and searches payment audit without a scan', async t => {
    await app.bean.executor.mockCtx(async () => {
      if (app.bean.database.current.dialectName !== 'better-sqlite3') {
        t.skip('SQLite index introspection and query plan');
        return;
      }
      const db = app.bean.database.current.connection;
      for (const [table, fields] of Object.entries(expectedIndexes)) {
        const indexList = (await db.raw(`PRAGMA index_list("${table}")`)) as Array<{
          name: string;
          unique: number;
        }>;
        for (const field of fields) {
          const name = `idx_${table}_${field}`;
          const index = indexList.find(item => item.name === name);
          assert.ok(index, `missing ${name}`);
          assert.equal(index.unique, 0, `${name} must not be unique`);
          const columns = (await db.raw(`PRAGMA index_xinfo("${name}")`)) as Array<{
            name: string;
            key: number;
          }>;
          assert.deepEqual(
            columns.filter(column => column.key === 1).map(column => column.name),
            [field],
          );
        }
      }

      for (const eventField of ['providerEventId', 'idempotencyKey']) {
        const queryPlan = (await db.raw(
          `EXPLAIN QUERY PLAN SELECT id FROM commercePaymentAudit WHERE iid = ? AND deleted = ? AND paymentAttemptId = ? AND "${eventField}" = ?`,
          [1, 0, 1, 'event'],
        )) as Array<{ detail: string }>;
        assert.ok(
          queryPlan.some(step =>
            /SEARCH commercePaymentAudit USING INDEX idx_commercePaymentAudit_/.test(step.detail),
          ),
          `${eventField}: ${JSON.stringify(queryPlan)}`,
        );
        assert.ok(
          queryPlan.every(step => !/SCAN commercePaymentAudit/.test(step.detail)),
          `${eventField}: ${JSON.stringify(queryPlan)}`,
        );
      }
    });
  });
});
