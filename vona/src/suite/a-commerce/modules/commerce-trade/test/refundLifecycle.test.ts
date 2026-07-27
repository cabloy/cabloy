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
  if (fixture.orderId !== undefined) {
    const requests = await payment.model.refundRequest.select({
      where: { orderId: fixture.orderId },
    });
    for (const request of requests) {
      await payment.model.refundAudit.delete({ refundRequestId: request.id });
      await payment.model.refundAttempt.delete({ refundRequestId: request.id });
    }
    await payment.model.refundRequest.delete({ orderId: fixture.orderId });
    await trade.model.shipment.delete({ orderId: fixture.orderId });
  }
  if (fixture.paymentAttemptId !== undefined) {
    await payment.model.paymentAudit.delete({ paymentAttemptId: fixture.paymentAttemptId });
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  }
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

async function createPaidOrder(suffix: string): Promise<IFixture> {
  const fixture: IFixture = {};
  await app.bean.passport.signinMock();
  fixture.categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
    body: { name: `refund-category-${suffix}`, published: true },
  });
  fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
    body: { categoryId: fixture.categoryId, title: `refund-product-${suffix}`, published: true },
  });
  fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
    body: {
      productId: fixture.productId,
      code: `refund-sku-${suffix}`,
      priceCents: 1299,
      attributes: [],
      lifecycle: 'active',
    },
  });
  fixture.balanceId = (
    await app.scope('commerce-trade').service.stockBalance.adjustStock({
      skuId: fixture.skuId,
      delta: 1,
      reason: 'refund fixture',
      correlationId: `refund-stock-${suffix}`,
    })
  ).id as number;
  await app.bean.passport.signout();
  fixture.customerName = `refund-customer-${suffix}`;
  const customer = await app.bean.user.register({ name: fixture.customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(fixture.customerName as any);
  const userId = app.bean.passport.currentUser!.id;
  fixture.templateId = (
    await app.scope('commerce-promotion').model.couponTemplate.insert({
      name: `refund-coupon-${suffix}`,
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
      correlationId: `refund-coupon-${suffix}`,
      reason: 'refund fixture',
    })
  ).id as number;
  fixture.addressId = await app.bean.executor.performAction(
    'post',
    '/commerce/member/address/createMine',
    {
      body: {
        recipientName: 'Refund Customer',
        phone: '15555550136',
        countryCode: 'US',
        region: 'California',
        city: 'San Francisco',
        postalCode: '94105',
        addressLine1: '9 Market Street',
      },
    },
  );
  const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
  fixture.cartId = cart.id as number;
  await app
    .scope('commerce-trade')
    .model.cartItem.insert({ cartId: cart.id, skuId: fixture.skuId, quantity: 1 });
  const checkout = await app.scope('commerce-trade').service.order.checkout({
    addressId: fixture.addressId,
    couponGrantId: fixture.grantId,
    correlationId: `refund-checkout-${suffix}`,
  });
  fixture.orderId = checkout.orderId as number;
  fixture.paymentAttemptId = checkout.paymentAttemptId as number;
  await app.scope('commerce-trade').service.order.applyPaymentOutcome(fixture.paymentAttemptId, {
    outcome: 'succeeded',
    idempotencyKey: `refund-payment-${suffix}`,
  });
  return fixture;
}

describe('refundLifecycle.test.ts', { concurrency: false, sequential: true }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock();
  });

  after(() => {
    releaseTestLock?.();
  });

  it('refunds a paid order exactly once, restores stock, and keeps the coupon redeemed', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
        const order = app.scope('commerce-trade').service.order;
        const request = await order.requestRefund(fixture.orderId!, {
          reason: 'wrong item',
          idempotencyKey: 'request-success-1',
        });
        const requestReplay = await order.requestRefund(fixture.orderId!, {
          reason: 'wrong item',
          idempotencyKey: 'request-success-1',
        });
        assert.deepEqual(requestReplay, request);
        await app.bean.passport.signout();
        await app.bean.passport.signinMock();
        const approved = await order.approveRefund(fixture.orderId!, {
          reason: 'approved',
          idempotencyKey: 'approve-success-1',
        });
        const approvedReplay = await order.approveRefund(fixture.orderId!, {
          reason: 'approved',
          idempotencyKey: 'approve-success-1',
        });
        assert.deepEqual(approvedReplay, approved);
        const settled = await order.applyRefundOutcome(fixture.orderId!, {
          outcome: 'succeeded',
          idempotencyKey: 'outcome-success-1',
        });
        const settledReplay = await order.applyRefundOutcome(fixture.orderId!, {
          outcome: 'succeeded',
          idempotencyKey: 'outcome-success-1',
        });
        assert.deepEqual(settledReplay, settled);
        const line = await app
          .scope('commerce-trade')
          .model.orderLine.get({ orderId: fixture.orderId });
        const reservation = await app
          .scope('commerce-trade')
          .model.stockReservation.get({ orderLineId: line?.id });
        const balance = await app
          .scope('commerce-trade')
          .model.stockBalance.getById(fixture.balanceId!);
        const grant = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(fixture.grantId!);
        const audits = await app
          .scope('commerce-payment')
          .model.refundAudit.select({ where: { orderId: fixture.orderId } });
        assert.deepEqual(
          [settled.orderState, settled.refundState, settled.refundAttemptState],
          ['refunded', 'refunded', 'succeeded'],
        );
        assert.equal(reservation?.state, 'restored');
        assert.deepEqual([balance?.onHand, balance?.reserved, balance?.available], [1, 0, 1]);
        assert.equal(grant?.state, 'redeemed');
        assert.deepEqual(audits.map(item => item.toRefundState).sort(), [
          'approved',
          'refunded',
          'requested',
        ]);
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('preserves rejected and failed cycles while permitting a fresh request', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
        const order = app.scope('commerce-trade').service.order;
        const first = await order.requestRefund(fixture.orderId!, {
          reason: 'first',
          idempotencyKey: 'request-rejected-1',
        });
        await app.bean.passport.signout();
        await app.bean.passport.signinMock();
        await order.rejectRefund(fixture.orderId!, {
          reason: 'declined',
          idempotencyKey: 'reject-1',
        });
        await app.bean.passport.signout();
        await app.bean.passport.signinMock(fixture.customerName as any);
        const second = await order.requestRefund(fixture.orderId!, {
          reason: 'second',
          idempotencyKey: 'request-rejected-2',
        });
        assert.notEqual(String(second.refundRequestId), String(first.refundRequestId));
        await app.bean.passport.signout();
        await app.bean.passport.signinMock();
        const approved = await order.approveRefund(fixture.orderId!, {
          reason: 'approved',
          idempotencyKey: 'approve-failed-1',
        });
        await order.applyRefundOutcome(fixture.orderId!, {
          outcome: 'failed',
          idempotencyKey: 'outcome-failed-1',
        });
        await app.bean.passport.signout();
        await app.bean.passport.signinMock(fixture.customerName as any);
        const third = await order.requestRefund(fixture.orderId!, {
          reason: 'third',
          idempotencyKey: 'request-failed-3',
        });
        assert.notEqual(String(third.refundRequestId), String(second.refundRequestId));
        assert.ok(approved.refundAttemptId);
        const requests = await app
          .scope('commerce-payment')
          .model.refundRequest.select({ where: { orderId: fixture.orderId } });
        assert.deepEqual(requests.map(item => item.state).sort(), [
          'failed',
          'rejected',
          'requested',
        ]);
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('denies anonymous and non-admin refund actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
        await app.bean.passport.signout();
        await assert.rejects(
          app.bean.executor.performAction(
            'post',
            `/commerce/trade/order/${fixture.orderId}/requestRefund`,
            {
              innerAccess: false,
              body: { reason: 'anonymous', idempotencyKey: 'anonymous-1' },
            },
          ),
          (error: any) => error.code === 401,
        );
        await app.bean.passport.signinMock(fixture.customerName as any);
        await app.scope('commerce-trade').service.order.requestRefund(fixture.orderId!, {
          reason: 'customer',
          idempotencyKey: 'customer-1',
        });
        await assert.rejects(
          app.bean.executor.performAction(
            'post',
            `/commerce/trade/order/${fixture.orderId}/approveRefund`,
            {
              innerAccess: false,
              body: { reason: 'not admin', idempotencyKey: 'not-admin-1' },
            },
          ),
          (error: any) => error.code === 403,
        );
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });
});
