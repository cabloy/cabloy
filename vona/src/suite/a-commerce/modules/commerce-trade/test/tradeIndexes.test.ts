import type { IMetaOptionsIndex } from 'vona-module-a-index';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { appResource } from 'vona';
import { app } from 'vona-mock';

const expectedIndexes = {
  commerceTradeCart: 'userId',
  commerceTradeCartItem: ['cartId', 'skuId'],
  commerceTradeOrder: ['userId', 'correlationId', 'state', 'reservationExpiresAt'],
  commerceTradeOrderLine: ['orderId', 'skuId'],
  commerceTradeShipment: ['orderId', 'correlationId'],
  commerceTradeOrderAudit: ['orderId', 'correlationId'],
  commerceTradeStockAudit: ['stockBalanceId', 'skuId', 'stockReservationId', 'correlationId'],
  commerceTradeStockBalance: 'skuId',
  commerceTradeStockReservation: [
    'stockBalanceId',
    'skuId',
    'orderLineId',
    'correlationId',
    'state',
  ],
};

describe('tradeIndexes.test.ts', { concurrency: false }, () => {
  it('registers every trade index without overwriting table keys', () => {
    const options = appResource.getBean('commerce-trade.meta.index')?.options as IMetaOptionsIndex;
    assert.ok(options);
    assert.deepEqual(options.indexes, expectedIndexes);
  });

  it('creates non-unique single-column trade indexes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const database = app.bean.database.current;
      const db = database.connection;
      for (const [table, value] of Object.entries(expectedIndexes)) {
        const fields = Array.isArray(value) ? value : [value];
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
