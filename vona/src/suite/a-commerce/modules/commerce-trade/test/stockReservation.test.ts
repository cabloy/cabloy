import type { EntityStockReservation } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { app } from 'vona-mock';

import { acquireTestLock } from './testLock.ts';

interface IStockFixture {
  categoryId: number;
  productId: number;
  skuId: number;
}

type IStockFixturePartial = Partial<IStockFixture>;

function createTestId() {
  return randomUUID().slice(0, 12);
}

async function createSku(suffix: string, fixtures: IStockFixturePartial[]): Promise<IStockFixture> {
  const fixture: IStockFixturePartial = {};
  fixtures.push(fixture);
  fixture.categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `reservation-category-${suffix}`, published: true },
  });
  fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: {
      categoryId: fixture.categoryId,
      title: `reservation-product-${suffix}`,
      published: true,
    },
  });
  fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId: fixture.productId,
      code: `reservation-sku-${suffix}`,
      priceCents: 100,
      lifecycle: 'active',
    },
  });
  return fixture as IStockFixture;
}

async function prepareStock(
  suffix: string,
  fixtures: IStockFixturePartial[],
  quantity = 3,
): Promise<IStockFixture> {
  const fixture = await createSku(suffix, fixtures);
  await app.scope('commerce-trade').service.stockBalance.adjustStock({
    skuId: fixture.skuId,
    delta: quantity,
    reason: 'reservation test setup',
    correlationId: `reservation-setup-${suffix}`,
  });
  return fixture;
}

async function dropStockFixtures(fixtures: IStockFixturePartial[]) {
  const scopeTrade = app.scope('commerce-trade');
  const scopeCatalog = app.scope('commerce-catalog');
  for (const fixture of fixtures.toReversed()) {
    if (fixture.skuId !== undefined) {
      await scopeTrade.model.stockAudit.delete({ skuId: fixture.skuId });
      await scopeTrade.model.stockReservation.delete({ skuId: fixture.skuId });
      await scopeTrade.model.stockBalance.delete({ skuId: fixture.skuId });
      await scopeCatalog.model.sku.delete({ id: fixture.skuId });
    }
    if (fixture.productId !== undefined) {
      await scopeCatalog.model.product.delete({ id: fixture.productId });
    }
    if (fixture.categoryId !== undefined) {
      await scopeCatalog.model.category.delete({ id: fixture.categoryId });
    }
  }
}

async function reserve(
  skuId: number,
  suffix: string,
  quantity = 2,
): Promise<EntityStockReservation> {
  return await app.scope('commerce-trade').service.stockBalance.reserve({
    skuId,
    quantity,
    reason: 'reservation test',
    correlationId: `reservation-${suffix}`,
  });
}

async function assertReservationRejected(skuId: number, suffix: string, expectedCode: number) {
  const [_, err] = await catchError(() => reserve(skuId, suffix));
  assert.equal(err?.code, expectedCode);
  const balance = await app.scope('commerce-trade').model.stockBalance.get({ skuId });
  assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [3, 0, 3]);
  assert.equal(await app.scope('commerce-trade').model.stockReservation.get({ skuId }), undefined);
  const audits = await app.scope('commerce-trade').model.stockAudit.select({
    where: { skuId },
    orders: [['id', 'asc']],
  });
  assert.deepEqual(
    audits.map(audit => audit.operation),
    ['adjust'],
  );
}

describe('stockReservation.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock();
  });

  after(() => {
    releaseTestLock?.();
  });

  it('reserves and consumes stock exactly once with traceable audits', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = createTestId();
        const fixture = await prepareStock(suffix, fixtures);
        const reservation = await reserve(fixture.skuId, suffix);
        const balanceAfterReserve = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual(
          [
            balanceAfterReserve?.onHand,
            balanceAfterReserve?.reserved,
            balanceAfterReserve?.available,
          ],
          [3, 2, 1],
        );

        const duplicate = await reserve(fixture.skuId, suffix);
        assert.equal(duplicate.id, reservation.id);
        const consumed = await app.scope('commerce-trade').service.stockBalance.consume({
          reservationId: reservation.id,
          reason: 'payment success',
        });
        assert.equal(consumed.state, 'consumed');
        const duplicateConsume = await app.scope('commerce-trade').service.stockBalance.consume({
          reservationId: reservation.id,
          reason: 'payment success retry',
        });
        assert.equal(duplicateConsume.state, 'consumed');

        const balanceAfterConsume = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual(
          [
            balanceAfterConsume?.onHand,
            balanceAfterConsume?.reserved,
            balanceAfterConsume?.available,
          ],
          [1, 0, 1],
        );
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
          orders: [['id', 'asc']],
        });
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['adjust', 'reserve', 'consume'],
        );
        assert.equal(audits[1].stockReservationId, reservation.id);
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });

  it('rejects reservations for inactive or unpublished catalog data without writes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = createTestId();
        const inactiveSku = await prepareStock(`${suffix}-inactive`, fixtures);
        await app.scope('commerce-catalog').model.sku.updateById(inactiveSku.skuId, {
          lifecycle: 'inactive',
        });
        await assertReservationRejected(inactiveSku.skuId, `${suffix}-inactive`, 404);

        const unpublishedProductSku = await prepareStock(`${suffix}-product`, fixtures);
        await app
          .scope('commerce-catalog')
          .model.product.updateById(unpublishedProductSku.productId, { published: false });
        await assertReservationRejected(unpublishedProductSku.skuId, `${suffix}-product`, 409);

        const unpublishedCategorySku = await prepareStock(`${suffix}-category`, fixtures);
        await app
          .scope('commerce-catalog')
          .model.category.updateById(unpublishedCategorySku.categoryId, { published: false });
        await assertReservationRejected(unpublishedCategorySku.skuId, `${suffix}-category`, 409);
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });

  it('releases and restores stock only from legal reservation states', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = createTestId();
        const fixture = await prepareStock(suffix, fixtures);
        const releasedReservation = await reserve(fixture.skuId, `${suffix}-release`);
        const released = await app.scope('commerce-trade').service.stockBalance.release({
          reservationId: releasedReservation.id,
          reason: 'payment failed',
        });
        assert.equal(released.state, 'released');
        const duplicateRelease = await app.scope('commerce-trade').service.stockBalance.release({
          reservationId: releasedReservation.id,
          reason: 'payment failed retry',
        });
        assert.equal(duplicateRelease.state, 'released');

        const consumedReservation = await reserve(fixture.skuId, `${suffix}-restore`, 1);
        await app.scope('commerce-trade').service.stockBalance.consume({
          reservationId: consumedReservation.id,
          reason: 'payment success',
        });
        const restored = await app.scope('commerce-trade').service.stockBalance.restore({
          reservationId: consumedReservation.id,
          reason: 'refund success',
        });
        assert.equal(restored.state, 'restored');
        const duplicateRestore = await app.scope('commerce-trade').service.stockBalance.restore({
          reservationId: consumedReservation.id,
          reason: 'refund success retry',
        });
        assert.equal(duplicateRestore.state, 'restored');

        const [_, err] = await catchError(() =>
          app.scope('commerce-trade').service.stockBalance.consume({
            reservationId: releasedReservation.id,
            reason: 'invalid replay',
          }),
        );
        assert.equal(err?.code, 409);
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [3, 0, 3]);
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
          orders: [['id', 'asc']],
        });
        assert.equal(audits.length, 6);
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['adjust', 'reserve', 'release', 'reserve', 'consume', 'restore'],
        );
        assert.deepEqual(
          audits.map(audit => audit.stockBalanceId),
          audits.map(() => balance?.id),
        );
        assert.deepEqual(
          audits.map(audit => audit.stockReservationId),
          [
            null,
            releasedReservation.id,
            releasedReservation.id,
            consumedReservation.id,
            consumedReservation.id,
            consumedReservation.id,
          ],
        );
        assert.deepEqual(
          audits.map(audit => audit.correlationId),
          [
            `reservation-setup-${suffix}`,
            `reservation-${suffix}-release`,
            `reservation-${suffix}-release`,
            `reservation-${suffix}-restore`,
            `reservation-${suffix}-restore`,
            `reservation-${suffix}-restore`,
          ],
        );
        assert.deepEqual(
          audits.map(audit => audit.reason),
          [
            'reservation test setup',
            'reservation test',
            'payment failed',
            'reservation test',
            'payment success',
            'refund success',
          ],
        );
        assert.deepEqual(
          audits.map(audit => [
            audit.delta,
            audit.priorOnHand,
            audit.priorReserved,
            audit.priorAvailable,
            audit.onHand,
            audit.reserved,
            audit.available,
          ]),
          [
            [3, 0, 0, 0, 3, 0, 3],
            [-2, 3, 0, 3, 3, 2, 1],
            [0, 3, 2, 1, 3, 0, 3],
            [-1, 3, 0, 3, 3, 1, 2],
            [-1, 3, 1, 2, 2, 0, 2],
            [1, 2, 0, 2, 3, 0, 3],
          ],
        );
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });

  it('allows exactly one independent reservation for the final unit', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixtures: IStockFixturePartial[] = [];
    const suffix = createTestId();
    let fixture!: IStockFixture;
    try {
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          fixture = await prepareStock(suffix, fixtures, 1);
        } finally {
          await app.bean.passport.signout();
        }
      });

      const reserveInContext = async (correlationSuffix: string) => {
        return await app.bean.executor.mockCtx(async () => {
          await app.bean.passport.signinMock();
          try {
            return await reserve(fixture.skuId, correlationSuffix, 1);
          } finally {
            await app.bean.passport.signout();
          }
        });
      };
      const results = await Promise.allSettled([
        reserveInContext(`${suffix}-first`),
        reserveInContext(`${suffix}-second`),
      ]);
      assert.equal(
        results.filter(result => result.status === 'fulfilled').length,
        1,
        JSON.stringify(results),
      );
      assert.equal(
        results.filter(result => result.status === 'rejected').length,
        1,
        JSON.stringify(results),
      );
      const rejected = results.find(result => result.status === 'rejected');
      assert.equal(
        (rejected as PromiseRejectedResult | undefined)?.reason?.code,
        409,
        String((rejected as PromiseRejectedResult | undefined)?.reason),
      );

      await app.bean.executor.mockCtx(async () => {
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 1, 0]);
        const reservations = await app.scope('commerce-trade').model.stockReservation.select({
          where: { skuId: fixture.skuId },
        });
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
          orders: [['id', 'asc']],
        });
        assert.equal(reservations.length, 1);
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['adjust', 'reserve'],
        );
        assert.equal(audits.filter(audit => audit.operation === 'reserve').length, 1);
        assert.equal(
          audits.some(audit => audit.correlationId === `reservation-${suffix}-first`) ||
            audits.some(audit => audit.correlationId === `reservation-${suffix}-second`),
          true,
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await dropStockFixtures(fixtures);
      });
    }
  });

  it('rolls back reservation, balance, and audit writes in one transaction', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = createTestId();
        const fixture = await prepareStock(suffix, fixtures);
        const balance = await app.scope('commerce-trade').model.stockBalance.get({
          skuId: fixture.skuId,
        });
        const db = app.ctx.db;
        const [_, err] = await catchError(async () => {
          await db.transaction.begin(async () => {
            const modelStockBalance = app
              .scope('commerce-trade')
              .model.stockBalance.newInstance(db);
            const modelStockReservation = app
              .scope('commerce-trade')
              .model.stockReservation.newInstance(db);
            const modelStockAudit = app.scope('commerce-trade').model.stockAudit.newInstance(db);
            const reservation = await modelStockReservation.insert({
              stockBalanceId: balance!.id,
              skuId: fixture.skuId,
              quantity: 2,
              state: 'reserved',
              correlationId: `reservation-${suffix}-rollback`,
            });
            await modelStockBalance.updateById(balance!.id, {
              onHand: 3,
              reserved: 2,
              available: 1,
            });
            await modelStockAudit.insert({
              stockBalanceId: balance!.id,
              skuId: fixture.skuId,
              stockReservationId: reservation.id,
              actorId: app.bean.passport.currentUser!.id,
              operation: 'reserve',
              delta: -2,
              reason: 'transaction rollback proof',
              correlationId: reservation.correlationId,
              priorOnHand: 3,
              priorReserved: 0,
              priorAvailable: 3,
              onHand: 3,
              reserved: 2,
              available: 1,
            });
            throw new Error('transaction rollback proof');
          });
        });
        assert.match(err?.message ?? '', /transaction rollback proof/);

        const unchanged = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual([unchanged?.onHand, unchanged?.reserved, unchanged?.available], [3, 0, 3]);
        assert.equal(
          await app.scope('commerce-trade').model.stockReservation.get({ skuId: fixture.skuId }),
          undefined,
        );
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
        });
        assert.equal(audits.length, 1);
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });
});
