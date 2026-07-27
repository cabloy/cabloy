import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  orderId?: number;
  userId?: number;
  customerName?: string;
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
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
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

async function createPaidOrder(suffix: string): Promise<IFixture> {
  const fixture: IFixture = { customerName: `shipment-refund-${suffix}` };
  const customer = await app.bean.user.register({ name: fixture.customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(fixture.customerName as any);
  try {
    const order = await app.scope('commerce-trade').model.order.insert({
      userId: customer.id,
      addressId: 1,
      correlationId: `shipment-refund-order-${suffix}`,
      addressSnapshot: {
        recipientName: 'Shipment Refund Customer',
        phone: '15555550136',
        countryCode: 'US',
        region: 'California',
        city: 'San Francisco',
        postalCode: '94105',
        addressLine1: '9 Market Street',
      },
      state: 'paid',
      currency: 'USD',
      eligibleSubtotalCents: 100,
      discountCents: 0,
      payableTotalCents: 100,
      reservationExpiresAt: new Date(Date.now() + 60_000),
    });
    fixture.orderId = order.id as number;
  } finally {
    await app.bean.passport.signout();
  }
  return fixture;
}

describe('shipmentRefundRace.test.ts', { concurrency: false, sequential: true }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('permits only shipment or refund request when PostgreSQL contenders share the paid order lock', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
      });
      const requestRefund = app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock(fixture.customerName as any);
        try {
          return await app.scope('commerce-trade').service.order.requestRefund(fixture.orderId!, {
            reason: 'race request',
            idempotencyKey: 'shipment-refund-race-request-1',
          });
        } finally {
          await app.bean.passport.signout();
        }
      });
      const ship = app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          return await app.scope('commerce-trade').service.order.ship(fixture.orderId!, {
            carrier: 'Cabloy Express',
            trackingNumber: 'CAB-RFD-1',
          });
        } finally {
          await app.bean.passport.signout();
        }
      });
      await Promise.allSettled([requestRefund, ship]);
      await app.bean.executor.mockCtx(async () => {
        const trade = app.scope('commerce-trade');
        const payment = app.scope('commerce-payment');
        const order = await trade.model.order.getById(fixture.orderId!);
        const shipments = await trade.model.shipment.select({
          where: { orderId: fixture.orderId },
        });
        const requests = await payment.model.refundRequest.select({
          where: { orderId: fixture.orderId },
        });
        const orderAudits = await trade.model.orderAudit.select({
          where: { orderId: fixture.orderId },
        });
        if (order?.state === 'shipped') {
          assert.equal(shipments.length, 1);
          assert.equal(requests.length, 0);
          assert.equal(orderAudits.filter(item => item.operation === 'shipped').length, 1);
          assert.equal(orderAudits.filter(item => item.operation === 'refund_requested').length, 0);
        } else {
          assert.equal(order?.state, 'refund_requested');
          assert.equal(shipments.length, 0);
          assert.equal(requests.length, 1);
          assert.equal(orderAudits.filter(item => item.operation === 'shipped').length, 0);
          assert.equal(orderAudits.filter(item => item.operation === 'refund_requested').length, 1);
        }
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });
});
