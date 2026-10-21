import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { DateTime } from 'luxon';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { lstat, open, rm } from 'node:fs/promises';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  appResource,
  assertDisposableDatabaseName,
  assertIsolatedTestPath,
  assertTestRunOwner,
  getDatabaseTestPrefix,
  registerTestClaimDatabaseCreation,
  resolveVonaLocalPaths,
} from 'vona';
import { app } from 'vona-mock';
import { MetaVersion } from 'vona-module-a-index';
import { ServiceDatabaseAsyncLocalStorage, ServiceDatabaseClient } from 'vona-module-a-orm';

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

const attemptedCopyNames = new Set<string>();

async function allocateOwnedSqliteCopy(source: ServiceDatabaseClient) {
  const runId = app.meta.env.VONA_TEST_RUN_ID;
  assert.ok(runId, 'the isolated SQLite copy requires a test run ID');
  const paths = resolveVonaLocalPaths(app.projectPath, 'test', runId);
  assertTestRunOwner(paths.dataRoot, runId);
  const prefix = getDatabaseTestPrefix(app.name, 'share');

  for (let offset = 0; offset < 3600; offset++) {
    const timestamp = DateTime.now().plus({ seconds: offset }).toFormat('yyyyMMdd-HHmmss');
    const databaseName = `${prefix}${timestamp}`;
    assertDisposableDatabaseName(databaseName, prefix);
    const filename = path.join(paths.sqliteRoot, `${databaseName}.db`);
    if (attemptedCopyNames.has(filename)) continue;
    const reservation = `${filename}.lock`;
    assertIsolatedTestPath(filename, path.join(paths.sqliteRoot, path.basename(filename)));
    assertIsolatedTestPath(reservation, path.join(paths.sqliteRoot, path.basename(reservation)));
    try {
      const reservationHandle = await open(reservation, 'wx');
      await reservationHandle.close();
      try {
        const exists = await lstat(filename).then(
          () => true,
          error => {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
            throw error;
          },
        );
        if (exists) {
          await rm(reservation);
          continue;
        }
        attemptedCopyNames.add(filename);
        await registerTestClaimDatabaseCreation(app, source.clientConfig, databaseName, 'intent');
        const databaseHandle = await open(filename, 'wx');
        await databaseHandle.close();
        await rm(filename);
        return { filename, paths, reservation };
      } catch (error) {
        await rm(reservation, { force: true });
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
    }
  }
  throw new Error('Unable to allocate an owned SQLite copy name');
}

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

  it('recovers missing indexes on an isolated copy of an existing database without changing its data', async t => {
    await app.bean.executor.mockCtx(async () => {
      if (app.bean.database.current.dialectName !== 'better-sqlite3') {
        t.skip('SQLite-only independent database copy');
        return;
      }
      const source = app.bean.database.current;
      const { filename, paths, reservation } = await allocateOwnedSqliteCopy(source.client);
      let client: ServiceDatabaseClient | undefined;
      try {
        await source.connection.raw('VACUUM main INTO ?', [filename]);
        await registerTestClaimDatabaseCreation(
          app,
          source.client.clientConfig,
          path.basename(filename, '.db'),
          'created',
        );
        const selector = `index-recovery-${randomUUID()}`;
        client = app.bean._newBean(ServiceDatabaseClient, selector, {
          client: 'better-sqlite3',
          connection: { filename },
          useNullAsDefault: true,
        });
        const isolated = client.db;
        await app.bean._getBean(ServiceDatabaseAsyncLocalStorage).run(isolated, async () => {
          const db = isolated.connection;
          const table = 'commercePaymentAudit';
          const missingIndex = `idx_${table}_providerEventId`;
          const retainedIndex = `idx_${table}_idempotencyKey`;
          const marker = `index-recovery-${randomUUID()}`;
          await db(table).insert({
            iid: 1,
            paymentAttemptId: 1,
            orderId: 1,
            userId: 1,
            provider: 'test',
            providerEventId: marker,
            outcome: 'failed',
            fromAttemptState: 'created',
            toOrderState: 'cancelled',
            idempotencyKey: marker,
            correlationId: marker,
            reason: 'test',
            processedAt: new Date(),
          });
          const versionsBefore = await db('aVersion')
            .where({ module: 'commerce-payment' })
            .select('version');
          await db.schema.alterTable(table, builder =>
            builder.dropIndex('providerEventId', missingIndex),
          );
          const indexesBefore = (await db.raw(`PRAGMA index_list("${table}")`)) as Array<{
            name: string;
          }>;
          assert.equal(
            indexesBefore.some(item => item.name === missingIndex),
            false,
          );
          assert.ok(indexesBefore.some(item => item.name === retainedIndex));

          const update = async () => {
            await app.bean._getBean(MetaVersion).update({ version: -1 });
          };
          for (let pass = 0; pass < 2; pass++) {
            await update();
            const indexes = (await db.raw(`PRAGMA index_list("${table}")`)) as Array<{
              name: string;
            }>;
            assert.equal(indexes.filter(item => item.name === missingIndex).length, 1);
            assert.equal(indexes.filter(item => item.name === retainedIndex).length, 1);
            const rows = await db(table).where({ providerEventId: marker, idempotencyKey: marker });
            assert.equal(rows.length, 1);
            assert.equal(rows[0].paymentAttemptId, 1);
            assert.deepEqual(
              await db('aVersion').where({ module: 'commerce-payment' }).select('version'),
              versionsBefore,
            );
          }
        });
      } finally {
        if (client) await client.connection.destroy();
        assertTestRunOwner(paths.dataRoot, paths.runId!);
        assertIsolatedTestPath(filename, filename);
        await source.connection.schema.dropDatabase(filename);
        await rm(reservation, { force: true });
      }
    });
  });
});
