import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

import type { CheckoutFailureStage } from '../src/service/order.ts';

interface IFixture {
  categoryId: number;
  productId: number;
  skuId: number;
  balanceId: number;
  templateId: number;
  grantId: number;
  addressId: number;
  cartId: number;
  cartItemId: number;
  userId: number;
  correlationId: string;
}

async function createFixture(suffix: string): Promise<IFixture> {
  const userId = app.bean.passport.currentUser!.id as number;
  const categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `checkout-txn-category-${suffix}`, published: true },
  });
  const productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: { categoryId, title: `checkout-txn-product-${suffix}`, published: true },
  });
  const skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId,
      code: `checkout-txn-sku-${suffix}`,
      priceCents: 1299,
      attributes: [],
      lifecycle: 'active',
    },
  });
  const balance = await app.scope('commerce-trade').service.stockBalance.adjustStock({
    skuId,
    delta: 1,
    reason: 'checkout transaction fixture',
    correlationId: `checkout-txn-stock-${suffix}`,
  });
  const template = await app.scope('commerce-promotion').model.couponTemplate.insert({
    name: `checkout-txn-coupon-${suffix}`,
    state: 'active',
    currency: 'USD',
    discountCents: 500,
    minSpendCents: 1000,
    validFrom: new Date(Date.now() - 1_000),
    validUntil: new Date(Date.now() + 60_000),
    issuedCount: 0,
    redeemedCount: 0,
  });
  const grant = await app.scope('commerce-promotion').service.coupon.issue({
    templateId: template.id,
    userId,
    correlationId: `checkout-txn-coupon-${suffix}`,
    reason: 'checkout transaction fixture',
  });
  const addressId = await app.bean.executor.performAction(
    'post',
    '/commerce/member/address/createMine',
    {
      body: {
        recipientName: 'Checkout Transaction Customer',
        phone: '15555550125',
        countryCode: 'US',
        region: 'California',
        city: 'San Francisco',
        postalCode: '94105',
        addressLine1: '3 Market Street',
      },
    },
  );
  const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
  const cartItem = await app.scope('commerce-trade').model.cartItem.insert({
    cartId: cart.id,
    skuId,
    quantity: 1,
  });
  return {
    categoryId,
    productId,
    skuId,
    balanceId: balance.id as number,
    templateId: template.id as number,
    grantId: grant.id as number,
    addressId,
    cartId: cart.id as number,
    cartItemId: cartItem.id as number,
    userId,
    correlationId: `checkout-txn-${suffix}`,
  };
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const promotion = app.scope('commerce-promotion');
  const catalog = app.scope('commerce-catalog');
  const member = app.scope('commerce-member');
  const orders = await trade.model.order.select({
    where: { correlationId: fixture.correlationId },
  });
  for (const order of orders) {
    await payment.model.paymentAttempt.delete({ orderId: order.id });
    await trade.model.orderAudit.delete({ orderId: order.id });
    const lines = await trade.model.orderLine.select({ where: { orderId: order.id } });
    for (const line of lines) await trade.model.stockReservation.delete({ orderLineId: line.id });
    await trade.model.orderLine.delete({ orderId: order.id });
    await trade.model.order.delete({ id: order.id });
  }
  await promotion.model.couponAudit.delete({ couponGrantId: fixture.grantId });
  await promotion.model.couponGrant.delete({ id: fixture.grantId });
  await promotion.model.couponTemplate.delete({ id: fixture.templateId });
  await trade.model.cartItem.delete({ cartId: fixture.cartId });
  await trade.model.cart.delete({ id: fixture.cartId });
  await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  await trade.model.stockReservation.delete({ skuId: fixture.skuId });
  await trade.model.stockBalance.delete({ id: fixture.balanceId });
  await catalog.model.sku.delete({ id: fixture.skuId });
  await catalog.model.product.delete({ id: fixture.productId });
  await catalog.model.category.delete({ id: fixture.categoryId });
  await member.model.address.delete({ id: fixture.addressId });
  await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
  await app.bean.user.removeById(fixture.userId);
}

async function assertRollback(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const promotion = app.scope('commerce-promotion');
  assert.equal(await trade.model.order.get({ correlationId: fixture.correlationId }), undefined);
  assert.equal(await trade.model.stockReservation.get({ skuId: fixture.skuId }), undefined);
  const cartItem = await trade.model.cartItem.getById(fixture.cartItemId);
  assert.equal(cartItem?.quantity, 1);
  const balance = await trade.model.stockBalance.getById(fixture.balanceId);
  assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 0, 1]);
  const stockAudits = await trade.model.stockAudit.select({ where: { skuId: fixture.skuId } });
  assert.equal(stockAudits.filter(audit => audit.operation === 'reserve').length, 0);
  const grant = await promotion.model.couponGrant.getById(fixture.grantId);
  assert.equal(grant?.state, 'available');
  assert.equal(grant?.reservationOrderId, undefined);
  const couponAudits = await promotion.model.couponAudit.select({
    where: { couponGrantId: fixture.grantId },
  });
  assert.deepEqual(
    couponAudits.map(audit => audit.operation),
    ['issue'],
  );
}

describe('checkoutTransaction.test.ts', { concurrency: false, sequential: true }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  for (const stage of [
    'afterOrderSnapshot',
    'afterCouponReservation',
    'afterStockReservation',
    'afterPaymentAttempt',
    'afterOrderAudit',
    'afterCartMutation',
  ] satisfies CheckoutFailureStage[]) {
    it(`rolls back every checkout write when ${stage} fails`, async () => {
      await app.bean.executor.mockCtx(async () => {
        const suffix = randomUUID().slice(0, 12);
        const customerName = `checkout-txn-customer-${suffix}`;
        await app.bean.user.register({ name: customerName }, true);
        await app.bean.passport.signinMock(customerName as any);
        let fixture: IFixture | undefined;
        try {
          fixture = await createFixture(suffix);
          const [_, error] = await catchError(() =>
            app.scope('commerce-trade').service.order.checkoutForTest(
              {
                addressId: fixture.addressId,
                couponGrantId: fixture.grantId,
                correlationId: fixture.correlationId,
              },
              async currentStage => {
                if (currentStage === stage) throw new Error(`checkout test failure: ${stage}`);
              },
            ),
          );
          assert.match(error?.message ?? '', new RegExp(stage));
          await assertRollback(fixture);
          const result = await app.scope('commerce-trade').service.order.checkout({
            addressId: fixture.addressId,
            couponGrantId: fixture.grantId,
            correlationId: fixture.correlationId,
          });
          assert.equal(result.state, 'awaiting_payment');
        } finally {
          if (fixture) await cleanup(fixture);
          await app.bean.passport.signout();
        }
      });
    });
  }
});
