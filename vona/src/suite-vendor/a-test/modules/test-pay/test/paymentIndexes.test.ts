import type { IMetaOptionsIndex } from 'vona-module-a-index';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { appResource } from 'vona';
import { app } from 'vona-mock';

const expectedIndexes = {
  payPaymentSession: [
    'businessReference',
    'providerCorrelationReference',
    'state+expiresAt',
    'providerPaymentId',
    'providerOrderId',
    'providerCaptureId',
  ],
  payProviderOperation: [
    'paymentSessionId+kind',
    'refundOperationId',
    'nextAttemptAt+state',
    'claimExpiresAt+state',
    'idempotencyKey',
  ],
  payProviderOperationRecoveryAudit: [
    'providerOperationId+actionIdempotencyKey',
    'occurredAt+providerOperationId',
  ],
  payRefundOperation: [
    'paymentSessionId',
    'providerCorrelationReference',
    'providerRefundId',
    'state',
  ],
  payWebhookInbox: ['providerName+clientName', 'providerEventId', 'paymentSessionId', 'state'],
  payPaymentAudit: 'paymentSessionId',
  payOutboxEvent: ['refundOperationId', 'nextAttemptAt+state', 'claimExpiresAt+state'],
};

describe('paymentIndexes.test.ts', { concurrency: false }, () => {
  it('registers every payment index without overwriting table keys', () => {
    const options = appResource.getBean('a-pay.meta.index')?.options as IMetaOptionsIndex;
    assert.ok(options);
    assert.deepEqual(options.indexes, expectedIndexes);
  });

  it('creates the refund and recovery lookup indexes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const db = app.bean.database.current;
      for (const table of [
        'payRefundOperation',
        'payProviderOperation',
        'payProviderOperationRecoveryAudit',
      ]) {
        const indexes = await db.dialect.fetchIndexes(db.connection.schema, table);
        const names = new Set(indexes.map(index => index.indexName));
        for (const field of expectedIndexes[table]) {
          const firstColumn = field.split('+')[0];
          assert.ok(
            names.has(`idx_${table}_${firstColumn}`),
            `${table}: ${field}; indexes: ${[...names]}`,
          );
        }
      }
    });
  });
});
