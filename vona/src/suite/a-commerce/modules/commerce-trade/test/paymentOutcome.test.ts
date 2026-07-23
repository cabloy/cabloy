import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { app } from 'vona-mock';

import { acquireTestLock } from './testLock.ts';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  balanceId?: number;
  templateId?: number;
  grantId?: number;
  addressId?: number;
  cartId?: number;
  userId?: number;
  customerName?: string;
  orderId?: number;
  paymentAttemptId?: number;
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const promotion = app.scope('commerce-promotion');
  const catalog = app.scope('commerce-catalog');
  const member = app.scope('commerce-member');
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAudit.delete({ paymentAttemptId: fixture.paymentAttemptId });
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  if (fixture.orderId !== undefined)
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
  if (fixture.skuId !== undefined) await trade.model.stockAudit.delete({ skuId: fixture.skuId });
  if (fixture.orderId !== undefined) {
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) await trade.model.stockReservation.delete({ orderLineId: line.id });
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.cartId !== undefined) {
    await trade.model.cartItem.delete({ cartId: fixture.cartId });
    await trade.model.cart.delete({ id: fixture.cartId });
  }
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
  if (fixture.grantId !== undefined) {
    await promotion.model.couponAudit.delete({ couponGrantId: fixture.grantId });
    await promotion.model.couponGrant.delete({ id: fixture.grantId });
  }
  if (fixture.templateId !== undefined)
    await promotion.model.couponTemplate.delete({ id: fixture.templateId });
  if (fixture.balanceId !== undefined)
    await trade.model.stockBalance.delete({ id: fixture.balanceId });
  if (fixture.skuId !== undefined) await catalog.model.sku.delete({ id: fixture.skuId });
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

async function createCheckoutFixture(suffix: string, withCoupon = true): Promise<IFixture> {
  const fixture: IFixture = {};
  await app.bean.passport.signinMock();
  fixture.categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `payment-category-${suffix}`, published: true },
  });
  fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: {
      categoryId: fixture.categoryId,
      title: `payment-product-${suffix}`,
      published: true,
    },
  });
  fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId: fixture.productId,
      code: `payment-sku-${suffix}`,
      priceCents: 1299,
      attributes: [],
      lifecycle: 'active',
    },
  });
  fixture.balanceId = (
    await app.scope('commerce-trade').service.stockBalance.adjustStock({
      skuId: fixture.skuId,
      delta: 1,
      reason: 'payment outcome fixture',
      correlationId: `payment-stock-${suffix}`,
    })
  ).id as number;
  await app.bean.passport.signout();
  const customerName = `payment-customer-${suffix}`;
  fixture.customerName = customerName;
  const customer = await app.bean.user.register({ name: customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(customerName as any);
  const userId = app.bean.passport.currentUser!.id;
  if (withCoupon) {
    fixture.templateId = (
      await app.scope('commerce-promotion').model.couponTemplate.insert({
        name: `payment-coupon-${suffix}`,
        state: 'active',
        currency: 'USD',
        discountCents: 500,
        minSpendCents: 1000,
        validFrom: new Date(Date.now() - 1_000),
        validUntil: new Date(Date.now() + 60_000),
        issuedCount: 0,
        redeemedCount: 0,
      })
    ).id as number;
    fixture.grantId = (
      await app.scope('commerce-promotion').service.coupon.issue({
        templateId: fixture.templateId,
        userId,
        correlationId: `payment-coupon-${suffix}`,
        reason: 'payment outcome fixture',
      })
    ).id as number;
  }
  fixture.addressId = await app.bean.executor.performAction('post', '/commerce/member/address', {
    body: {
      recipientName: 'Payment Customer',
      phone: '15555550136',
      countryCode: 'US',
      region: 'California',
      city: 'San Francisco',
      postalCode: '94105',
      addressLine1: '9 Market Street',
    },
  });
  const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
  fixture.cartId = cart.id as number;
  await app.scope('commerce-trade').model.cartItem.insert({
    cartId: cart.id,
    skuId: fixture.skuId,
    quantity: 1,
  });
  const checkout = await app.scope('commerce-trade').service.order.checkout({
    addressId: fixture.addressId,
    couponGrantId: fixture.grantId,
    correlationId: `payment-checkout-${suffix}`,
  });
  fixture.orderId = checkout.orderId as number;
  fixture.paymentAttemptId = checkout.paymentAttemptId as number;
  return fixture;
}

describe('paymentOutcome.test.ts', { concurrency: false, sequential: true }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock();
  });

  after(() => {
    releaseTestLock?.();
  });

  it('settles a successful payment exactly once with stock and coupon consumption', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const first = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'success-1',
          });
        const replay = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'success-1',
          });
        assert.deepEqual(replay, first);
        assert.deepEqual(
          [first.orderState, first.paymentAttemptState, first.payableTotalCents],
          ['paid', 'succeeded', 799],
        );
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.getById(fixture.balanceId!);
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        const paymentAudits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(reservation?.state, 'consumed');
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [0, 0, 0]);
        assert.equal(grant?.state, 'redeemed');
        assert.equal(paymentAudits.length, 1);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('accepts one concurrent PostgreSQL success event without duplicate effects', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const settle = async () => {
          return await app.bean.executor.mockCtx(async () => {
            await app.bean.passport.signinMock(fixture.customerName as any);
            try {
              return await app
                .scope('commerce-trade')
                .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
                  outcome: 'succeeded',
                  idempotencyKey: 'concurrent-success-1',
                });
            } finally {
              await app.bean.passport.signout();
            }
          });
        };
        const results = await Promise.allSettled([settle(), settle()]);
        assert.equal(results.filter(result => result.status === 'fulfilled').length, 2);
        const audits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(audits.length, 1);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        assert.equal(reservation?.state, 'consumed');
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('permits only one terminal outcome when payment success races expiry', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const deadline = new Date(Date.now() + 60_000);
        await app.scope('commerce-trade').model.order.updateById(fixture.orderId!, {
          reservationExpiresAt: deadline,
        });
        const success = app.bean.executor.mockCtx(async () => {
          await app.bean.passport.signinMock(fixture.customerName as any);
          try {
            return await app
              .scope('commerce-trade')
              .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
                outcome: 'succeeded',
                idempotencyKey: 'expiry-race-1',
              });
          } finally {
            await app.bean.passport.signout();
          }
        });
        const expiry = app.bean.executor.mockCtx(async () => {
          return await app
            .scope('commerce-trade')
            .service.order.expireIfDue(fixture.orderId!, new Date(deadline.getTime() + 1));
        });
        await Promise.allSettled([success, expiry]);
        const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
        const attempt = await app
          .scope('commerce-payment')
          .model.paymentAttempt.getById(fixture.paymentAttemptId!);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        if (order?.state === 'paid') {
          assert.deepEqual(
            [attempt?.state, reservation?.state, grant?.state],
            ['succeeded', 'consumed', 'redeemed'],
          );
        } else {
          assert.deepEqual(
            [order?.state, attempt?.state, reservation?.state],
            ['expired', 'cancelled', 'released'],
          );
          assert.ok(grant?.state === 'available' || grant?.state === 'expired');
        }
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('rejects conflicting payment event reuse without another transition', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'succeeded',
            idempotencyKey: 'conflict-1',
          });
        await assert.rejects(
          app.scope('commerce-trade').service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'failed',
            idempotencyKey: 'conflict-1',
          }),
          (error: any) => error.code === 409,
        );
        const paymentAudits = await app.scope('commerce-payment').model.paymentAudit.select({
          where: { paymentAttemptId: fixture.paymentAttemptId },
        });
        assert.equal(paymentAudits.length, 1);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('releases a failed payment exactly once and cancels the order', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createCheckoutFixture(randomUUID().slice(0, 12)));
        const first = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'failed',
            idempotencyKey: 'failure-1',
          });
        const replay = await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId!, {
            outcome: 'failed',
            idempotencyKey: 'failure-1',
          });
        assert.deepEqual(replay, first);
        assert.deepEqual([first.orderState, first.paymentAttemptState], ['cancelled', 'failed']);
        const line = await app.scope('commerce-trade').model.orderLine.get({
          orderId: fixture.orderId,
        });
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: line?.id,
        });
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.getById(fixture.balanceId!);
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        assert.equal(reservation?.state, 'released');
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 0, 1]);
        assert.equal(grant?.state, 'available');
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
