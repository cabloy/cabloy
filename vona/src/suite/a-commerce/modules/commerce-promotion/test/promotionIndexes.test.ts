import type { IMetaOptionsIndex } from 'vona-module-a-index';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { appResource } from 'vona';
import { app } from 'vona-mock';

const expectedIndexes = {
  commercePromotionCouponTemplate: ['state', 'validUntil'],
  commercePromotionCouponGrant: [
    'templateId',
    'userId',
    'state',
    'validUntilSnapshot',
    'reservationOrderId',
    'reservationCorrelationId',
    'redeemedOrderId',
  ],
  commercePromotionCouponAudit: ['couponGrantId', 'templateId', 'orderId', 'correlationId'],
};

describe('promotionIndexes.test.ts', { concurrency: false }, () => {
  it('registers every coupon index without overwriting table keys', () => {
    const options = appResource.getBean('commerce-promotion.meta.index')
      ?.options as IMetaOptionsIndex;
    assert.ok(options);
    assert.deepEqual(options.indexes, expectedIndexes);
  });

  it('creates non-unique single-column coupon indexes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const database = app.bean.database.current;
      const db = database.connection;
      for (const [table, fields] of Object.entries(expectedIndexes)) {
        const indexes = await database.dialect.fetchIndexes(db.schema, table);
        for (const field of fields) {
          const name = `idx_${table}_${field}`;
          assert.ok(
            indexes.some(index => index.indexName === name),
            `missing ${name}`,
          );
          if (database.dialectName === 'better-sqlite3') {
            const details = (await db.raw(`PRAGMA index_list("${table}")`)) as Array<{
              name: string;
              unique: number;
            }>;
            assert.equal(details.find(index => index.name === name)?.unique, 0);
            const columns = (await db.raw(`PRAGMA index_xinfo("${name}")`)) as Array<{
              name: string;
              key: number;
            }>;
            assert.deepEqual(
              columns.filter(column => column.key === 1).map(column => column.name),
              [field],
            );
          } else if (database.dialectName === 'mysql2') {
            const [details] = (await db.raw(`SHOW INDEX FROM \`${table}\``)) as [
              Array<{
                Key_name: string;
                Non_unique: number;
                Seq_in_index: number;
                Column_name: string;
              }>,
            ];
            const columns = details.filter(index => index.Key_name === name);
            assert.ok(columns.length, `missing ${name}`);
            assert.ok(
              columns.every(index => index.Non_unique === 1),
              `${name} must not be unique`,
            );
            assert.deepEqual(
              columns
                .sort((a, b) => a.Seq_in_index - b.Seq_in_index)
                .map(index => index.Column_name),
              [field],
            );
          }
        }
      }
    });
  });
});
