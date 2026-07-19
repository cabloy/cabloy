import type { EntityStockReservation } from 'vona-module-commerce-trade';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

async function createSku(suffix: string): Promise<number> {
  const categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `reservation-category-${suffix}`, published: true },
  });
  const productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: { categoryId, title: `reservation-product-${suffix}`, published: true },
  });
  return await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId,
      code: `reservation-sku-${suffix}`,
      priceCents: 100,
      lifecycle: 'active',
    },
  });
}

async function prepareStock(suffix: string, quantity = 3): Promise<number> {
  const skuId = await createSku(suffix);
  await app.scope('commerce-trade').service.stockBalance.adjustStock({
    skuId,
    delta: quantity,
    reason: 'reservation test setup',
    correlationId: `reservation-setup-${suffix}`,
  });
  return skuId;
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

describe('stockReservation.test.ts', () => {
  it('reserves and consumes stock exactly once with traceable audits', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = `${Date.now()}`;
      await app.bean.passport.signinMock();
      try {
        const skuId = await prepareStock(suffix);
        const reservation = await reserve(skuId, suffix);
        const balanceAfterReserve = await app
          .scope('commerce-trade')
          .model.stockBalance.get({ skuId });
        assert.deepEqual(
          [
            balanceAfterReserve?.onHand,
            balanceAfterReserve?.reserved,
            balanceAfterReserve?.available,
          ],
          [3, 2, 1],
        );

        const duplicate = await reserve(skuId, suffix);
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
          .model.stockBalance.get({ skuId });
        assert.deepEqual(
          [
            balanceAfterConsume?.onHand,
            balanceAfterConsume?.reserved,
            balanceAfterConsume?.available,
          ],
          [1, 0, 1],
        );
        const audits = await app
          .scope('commerce-trade')
          .model.stockAudit.select({ where: { skuId } });
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['adjust', 'reserve', 'consume'],
        );
        assert.equal(audits[1].stockReservationId, reservation.id);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('releases and restores stock only from legal reservation states', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = `${Date.now()}`;
      await app.bean.passport.signinMock();
      try {
        const skuId = await prepareStock(suffix);
        const releasedReservation = await reserve(skuId, `${suffix}-release`);
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

        const consumedReservation = await reserve(skuId, `${suffix}-restore`, 1);
        await app.scope('commerce-trade').service.stockBalance.consume({
          reservationId: consumedReservation.id,
          reason: 'payment success',
        });
        const restored = await app.scope('commerce-trade').service.stockBalance.restore({
          reservationId: consumedReservation.id,
          reason: 'refund success',
        });
        assert.equal(restored.state, 'restored');

        const [_, err] = await catchError(() =>
          app.scope('commerce-trade').service.stockBalance.consume({
            reservationId: releasedReservation.id,
            reason: 'invalid replay',
          }),
        );
        assert.equal(err?.code, 409);
        const balance = await app.scope('commerce-trade').model.stockBalance.get({ skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [3, 0, 3]);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('allows exactly one competing reservation for the final unit', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = `${Date.now()}`;
      await app.bean.passport.signinMock();
      try {
        const skuId = await prepareStock(suffix, 1);
        const results = await Promise.allSettled([
          reserve(skuId, `${suffix}-first`, 1),
          reserve(skuId, `${suffix}-second`, 1),
        ]);
        assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
        assert.equal(results.filter(result => result.status === 'rejected').length, 1);

        const balance = await app.scope('commerce-trade').model.stockBalance.get({ skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 1, 0]);
        const reservations = await app.scope('commerce-trade').model.stockReservation.select({
          where: { skuId },
        });
        const audits = await app
          .scope('commerce-trade')
          .model.stockAudit.select({ where: { skuId } });
        assert.equal(reservations.length, 1);
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['adjust', 'reserve'],
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('rolls back reservation and balance when audit persistence fails', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = `${Date.now()}`;
      await app.bean.passport.signinMock();
      try {
        const skuId = await prepareStock(suffix);
        const modelStockAudit = app.scope('commerce-trade').model.stockAudit;
        const insert = modelStockAudit.insert.bind(modelStockAudit);
        (modelStockAudit as any).insert = async () => {
          throw new Error('reservation audit insert failure');
        };
        try {
          const [_, err] = await catchError(() => reserve(skuId, suffix));
          assert.match(err?.message ?? '', /reservation audit insert failure/);
        } finally {
          (modelStockAudit as any).insert = insert;
        }

        const balance = await app.scope('commerce-trade').model.stockBalance.get({ skuId });
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [3, 0, 3]);
        assert.equal(
          await app.scope('commerce-trade').model.stockReservation.get({ skuId }),
          undefined,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
