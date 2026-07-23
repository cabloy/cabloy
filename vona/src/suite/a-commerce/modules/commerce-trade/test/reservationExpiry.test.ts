import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  balanceId?: number;
  cartId?: number;
  addressId?: number;
  orderId?: number;
  orderLineId?: number;
  reservationId?: number;
  paymentAttemptId?: number;
  orderAuditIds?: number[];
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const member = app.scope('commerce-member');
  const catalog = app.scope('commerce-catalog');
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  if (fixture.orderId !== undefined)
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
  if (fixture.skuId !== undefined) await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  if (fixture.reservationId !== undefined)
    await trade.model.stockReservation.delete({ id: fixture.reservationId });
  if (fixture.orderLineId !== undefined)
    await trade.model.orderLine.delete({ id: fixture.orderLineId });
  if (fixture.orderId !== undefined) await trade.model.order.delete({ id: fixture.orderId });
  if (fixture.cartId !== undefined) {
    await trade.model.cartItem.delete({ cartId: fixture.cartId });
    await trade.model.cart.delete({ id: fixture.cartId });
  }
  if (fixture.balanceId !== undefined)
    await trade.model.stockBalance.delete({ id: fixture.balanceId });
  if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
}

describe('reservationExpiry.test.ts', { concurrency: false }, () => {
  it('expires an unpaid order and releases its reservation exactly once', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      try {
        await app.bean.passport.signinMock();
        const userId = app.bean.passport.currentUser!.id;
        fixture.categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: { name: `expiry-category-${suffix}`, published: true },
          },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: {
              categoryId: fixture.categoryId,
              title: `expiry-product-${suffix}`,
              published: true,
            },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: `expiry-sku-${suffix}`,
            priceCents: 899,
            attributes: [],
            lifecycle: 'active',
          },
        });
        const balance = await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: fixture.skuId,
          delta: 1,
          reason: 'expiry fixture',
          correlationId: `expiry-stock-${suffix}`,
        });
        fixture.balanceId = balance.id as number;
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address',
          {
            body: {
              recipientName: 'Expiry Customer',
              phone: '15555550124',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '2 Market Street',
            },
          },
        );
        const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
        fixture.cartId = cart.id as number;
        await app.scope('commerce-trade').model.cartItem.insert({
          cartId: cart.id,
          skuId: fixture.skuId,
          quantity: 1,
        });
        const created = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId,
          correlationId: `expiry-${suffix}`,
        });
        fixture.orderId = created.orderId as number;
        fixture.paymentAttemptId = created.paymentAttemptId as number;
        const line = await app
          .scope('commerce-trade')
          .model.orderLine.get({ orderId: created.orderId });
        fixture.orderLineId = line?.id as number;
        const reservation = await app
          .scope('commerce-trade')
          .model.stockReservation.get({ orderLineId: line?.id });
        fixture.reservationId = reservation?.id as number;
        await app.scope('commerce-trade').model.order.updateById(created.orderId, {
          reservationExpiresAt: new Date(Date.now() - 1),
        });

        assert.equal(
          await app.scope('commerce-trade').service.order.expireIfDue(created.orderId),
          true,
        );
        assert.equal(
          await app.scope('commerce-trade').service.order.expireIfDue(created.orderId),
          false,
        );
        const order = await app.scope('commerce-trade').model.order.getById(created.orderId);
        assert.equal(order?.state, 'expired');
        const released = await app
          .scope('commerce-trade')
          .model.stockReservation.getById(reservation!.id);
        assert.equal(released?.state, 'released');
        const attempt = await app
          .scope('commerce-payment')
          .model.paymentAttempt.getById(created.paymentAttemptId);
        assert.equal(attempt?.state, 'cancelled');
        const audits = await app.scope('commerce-trade').model.orderAudit.select({
          where: { orderId: created.orderId },
          orders: [['id', 'asc']],
        });
        assert.deepEqual(
          audits.map(item => item.operation),
          ['created', 'expired'],
        );
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
