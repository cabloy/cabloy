import type { EntityStockReservation } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface IStockFixture {
  categoryId: number;
  productId: number;
  skuId: number;
}

type IStockFixturePartial = Partial<IStockFixture>;

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
  const audits = await app.scope('commerce-trade').model.stockAudit.select({ where: { skuId } });
  assert.deepEqual(
    audits.map(audit => audit.operation),
    ['adjust'],
  );
}

describe('stockReservation.test.ts', () => {
  it('reserves and consumes stock exactly once with traceable audits', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = `${Date.now()}`;
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
        const suffix = `${Date.now()}`;
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
        const suffix = `${Date.now()}`;
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
          audits.map(audit => [audit.delta, audit.onHand, audit.reserved, audit.available]),
          [
            [3, 3, 0, 3],
            [-2, 3, 2, 1],
            [0, 3, 0, 3],
            [-1, 3, 1, 2],
            [-1, 2, 0, 2],
            [1, 3, 0, 3],
          ],
        );
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });

  it('allows exactly one competing reservation for the final unit', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = `${Date.now()}`;
        const fixture = await prepareStock(suffix, fixtures, 1);
        const results = await Promise.allSettled([
          reserve(fixture.skuId, `${suffix}-first`, 1),
          reserve(fixture.skuId, `${suffix}-second`, 1),
        ]);
        assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
        assert.equal(results.filter(result => result.status === 'rejected').length, 1);

        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 1, 0]);
        const reservations = await app.scope('commerce-trade').model.stockReservation.select({
          where: { skuId: fixture.skuId },
        });
        const audits = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
        });
        assert.equal(reservations.length, 1);
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['adjust', 'reserve'],
        );
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });

  it('rolls back reservation and balance when audit persistence fails', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixtures: IStockFixturePartial[] = [];
      await app.bean.passport.signinMock();
      try {
        const suffix = `${Date.now()}`;
        const fixture = await prepareStock(suffix, fixtures);
        const modelStockAudit = app.scope('commerce-trade').model.stockAudit;
        const insert = modelStockAudit.insert.bind(modelStockAudit);
        (modelStockAudit as any).insert = async () => {
          throw new Error('reservation audit insert failure');
        };
        try {
          const [_, err] = await catchError(() => reserve(fixture.skuId, suffix));
          assert.match(err?.message ?? '', /reservation audit insert failure/);
        } finally {
          (modelStockAudit as any).insert = insert;
        }

        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId: fixture.skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [3, 0, 3]);
        assert.equal(
          await app.scope('commerce-trade').model.stockReservation.get({ skuId: fixture.skuId }),
          undefined,
        );
      } finally {
        await dropStockFixtures(fixtures);
        await app.bean.passport.signout();
      }
    });
  });
});
