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
  cartItemId?: number;
  addressId?: number;
  orderId?: number;
  orderLineId?: number;
  paymentAttemptId?: number;
  orderAuditId?: number;
  reservationId?: number;
  stockAuditIds?: number[];
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const member = app.scope('commerce-member');
  const catalog = app.scope('commerce-catalog');
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  if (fixture.orderAuditId !== undefined)
    await trade.model.orderAudit.delete({ id: fixture.orderAuditId });
  if (fixture.skuId !== undefined) await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  if (fixture.reservationId !== undefined)
    await trade.model.stockReservation.delete({ id: fixture.reservationId });
  if (fixture.orderLineId !== undefined)
    await trade.model.orderLine.delete({ id: fixture.orderLineId });
  if (fixture.orderId !== undefined) await trade.model.order.delete({ id: fixture.orderId });
  if (fixture.cartItemId !== undefined)
    await trade.model.cartItem.delete({ id: fixture.cartItemId });
  if (fixture.cartId !== undefined) await trade.model.cart.delete({ id: fixture.cartId });
  if (fixture.balanceId !== undefined)
    await trade.model.stockBalance.delete({ id: fixture.balanceId });
  if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
}

describe('checkoutReservation.test.ts', { concurrency: false }, () => {
  it('creates an atomic checkout from the persisted cart and replays its correlation', async () => {
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
            body: { name: `checkout-category-${suffix}`, published: true },
          },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: {
              categoryId: fixture.categoryId,
              title: `checkout-product-${suffix}`,
              published: true,
            },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: `checkout-sku-${suffix}`,
            priceCents: 1299,
            attributes: [],
            lifecycle: 'active',
          },
        });
        const balance = await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: fixture.skuId,
          delta: 1,
          reason: 'checkout fixture',
          correlationId: `checkout-stock-${suffix}`,
        });
        fixture.balanceId = balance.id as number;
        const auditsBefore = await app.scope('commerce-trade').model.stockAudit.select({
          where: { skuId: fixture.skuId },
        });
        fixture.stockAuditIds = auditsBefore.map(item => item.id as number);
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address',
          {
            body: {
              recipientName: 'Checkout Customer',
              phone: '15555550123',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '1 Market Street',
            },
          },
        );
        const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
        fixture.cartId = cart.id as number;
        const cartItem = await app.scope('commerce-trade').model.cartItem.insert({
          cartId: cart.id,
          skuId: fixture.skuId,
          quantity: 1,
        });
        fixture.cartItemId = cartItem.id as number;

        const result = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId,
          correlationId: `checkout-${suffix}`,
        });
        fixture.orderId = result.orderId as number;
        fixture.paymentAttemptId = result.paymentAttemptId as number;
        assert.equal(result.state, 'awaiting_payment');
        assert.equal(result.payableTotalCents, 1299);
        assert.equal(
          await app.scope('commerce-trade').model.cartItem.getById(cartItem.id),
          undefined,
        );
        const line = await app
          .scope('commerce-trade')
          .model.orderLine.get({ orderId: result.orderId });
        fixture.orderLineId = line?.id as number;
        const reservation = await app
          .scope('commerce-trade')
          .model.stockReservation.get({ orderLineId: line?.id });
        fixture.reservationId = reservation?.id as number;
        assert.equal(reservation?.state, 'reserved');
        const audit = await app
          .scope('commerce-trade')
          .model.orderAudit.get({ orderId: result.orderId });
        fixture.orderAuditId = audit?.id as number;
        assert.equal(audit?.operation, 'created');
        const replay = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId,
          correlationId: `checkout-${suffix}`,
        });
        assert.equal(replay.orderId, result.orderId);
        assert.equal(replay.paymentAttemptId, result.paymentAttemptId);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
