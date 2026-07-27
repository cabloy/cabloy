import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  orderId?: number;
  paymentAttemptId?: number;
  customerName?: string;
  userId?: number;
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  if (fixture.orderId !== undefined)
    await trade.model.shipment.delete({ orderId: fixture.orderId });
  if (fixture.orderId !== undefined)
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAudit.delete({ paymentAttemptId: fixture.paymentAttemptId });
  if (fixture.paymentAttemptId !== undefined)
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  if (fixture.orderId !== undefined) {
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) await trade.model.stockReservation.delete({ orderLineId: line.id });
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

async function createPaidOrder(suffix: string): Promise<IFixture> {
  const fixture: IFixture = {};
  const customerName = `shipment-customer-${suffix}`;
  fixture.customerName = customerName;
  const customer = await app.bean.user.register({ name: customerName }, true);
  fixture.userId = customer.id as number;
  await app.bean.passport.signinMock(customerName as any);
  try {
    const order = await app.scope('commerce-trade').model.order.insert({
      userId: customer.id,
      addressId: 1,
      correlationId: `shipment-order-${suffix}`,
      addressSnapshot: {
        recipientName: 'Shipment Customer',
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

describe('shipment.test.ts', { concurrency: false, sequential: true }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('ships a paid order exactly once and exposes shipment only to its owner', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
        const actionPath = `/commerce/trade/order/${fixture.orderId}/ship`;
        const [_, anonymousError] = await catchError(() =>
          app.bean.executor.performAction('post', actionPath, {
            body: { carrier: 'Cabloy Express', trackingNumber: 'CAB-100' },
            innerAccess: false,
          }),
        );
        assert.equal(anonymousError?.code, 401);
        await app.bean.passport.signinMock(fixture.customerName as any);
        const [__, customerError] = await catchError(() =>
          app.bean.executor.performAction('post', actionPath, {
            body: { carrier: 'Cabloy Express', trackingNumber: 'CAB-100' },
            innerAccess: false,
          }),
        );
        assert.equal(customerError?.code, 403);
        await app.bean.passport.signout();
        await app.bean.passport.signinMock();
        const first = await app.bean.executor.performAction('post', actionPath, {
          body: { carrier: '  Cabloy Express  ', trackingNumber: '  CAB-100  ' },
          innerAccess: false,
        });
        const replay = await app.bean.executor.performAction('post', actionPath, {
          body: { carrier: 'Cabloy Express', trackingNumber: 'CAB-100' },
          innerAccess: false,
        });
        assert.deepEqual(replay, first);
        const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
        const shipment = await app.scope('commerce-trade').model.shipment.get({
          orderId: fixture.orderId,
        });
        const audits = await app.scope('commerce-trade').model.orderAudit.select({
          where: { orderId: fixture.orderId },
        });
        assert.equal(order?.state, 'shipped');
        assert.deepEqual(
          [shipment?.carrier, shipment?.trackingNumber, shipment?.operatorId],
          ['Cabloy Express', 'CAB-100', app.bean.passport.currentUser!.id],
        );
        assert.equal(audits.filter(audit => audit.operation === 'shipped').length, 1);
        await app.bean.passport.signout();
        await app.bean.passport.signinMock(fixture.customerName as any);
        const detail = await app.scope('commerce-trade').service.order.viewMine(fixture.orderId!);
        assert.deepEqual(detail?.shipment, first);
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('rejects invalid shipment commands and conflicting replays without mutations', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      try {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
        await app.bean.passport.signinMock();
        const [_, blankCarrier] = await catchError(() =>
          app.scope('commerce-trade').service.order.ship(fixture.orderId!, {
            carrier: ' ',
            trackingNumber: 'CAB-101',
          }),
        );
        assert.equal(blankCarrier?.code, 400);
        await app.scope('commerce-trade').service.order.ship(fixture.orderId!, {
          carrier: 'Cabloy Express',
          trackingNumber: 'CAB-101',
        });
        const [__, conflict] = await catchError(() =>
          app.scope('commerce-trade').service.order.ship(fixture.orderId!, {
            carrier: 'Cabloy Express',
            trackingNumber: 'CAB-102',
          }),
        );
        assert.equal(conflict?.code, 409);
        const shipments = await app.scope('commerce-trade').model.shipment.select({
          where: { orderId: fixture.orderId },
        });
        assert.equal(shipments.length, 1);
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('rolls back shipment, state, and audit on every transition failure stage', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const stage of ['afterShipmentInsert', 'afterOrderState', 'afterOrderAudit'] as const) {
        const fixture: IFixture = {};
        try {
          Object.assign(fixture, await createPaidOrder(`${randomUUID().slice(0, 8)}-${stage}`));
          await app.bean.passport.signinMock();
          const [_, err] = await catchError(() =>
            app
              .scope('commerce-trade')
              .service.order.shipForTest(
                fixture.orderId!,
                { carrier: 'Cabloy Express', trackingNumber: `CAB-${stage}` },
                currentStage => {
                  if (currentStage === stage) throw new Error(`injected ${stage}`);
                },
              ),
          );
          assert.match(err?.message ?? '', new RegExp(stage));
          const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
          const shipment = await app.scope('commerce-trade').model.shipment.get({
            orderId: fixture.orderId,
          });
          const audits = await app.scope('commerce-trade').model.orderAudit.select({
            where: { orderId: fixture.orderId },
          });
          assert.equal(order?.state, 'paid');
          assert.equal(shipment, undefined);
          assert.equal(audits.filter(audit => audit.operation === 'shipped').length, 0);
        } finally {
          await app.bean.passport.signout();
          await cleanup(fixture);
        }
      }
    });
  });

  it('serializes concurrent PostgreSQL shipment commands on the order row', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        Object.assign(fixture, await createPaidOrder(randomUUID().slice(0, 12)));
      });
      const ship = async () => {
        return await app.bean.executor.mockCtx(async () => {
          await app.bean.passport.signinMock();
          try {
            return await app.scope('commerce-trade').service.order.ship(fixture.orderId!, {
              carrier: 'Cabloy Express',
              trackingNumber: 'CAB-200',
            });
          } finally {
            await app.bean.passport.signout();
          }
        });
      };
      const results = await Promise.allSettled([ship(), ship()]);
      assert.equal(
        results.filter(result => result.status === 'fulfilled').length,
        2,
        JSON.stringify(results),
      );
      await app.bean.executor.mockCtx(async () => {
        const shipment = await app.scope('commerce-trade').model.shipment.select({
          where: { orderId: fixture.orderId },
        });
        const audits = await app.scope('commerce-trade').model.orderAudit.select({
          where: { orderId: fixture.orderId },
        });
        const order = await app.scope('commerce-trade').model.order.getById(fixture.orderId!);
        assert.equal(shipment.length, 1);
        assert.equal(audits.filter(audit => audit.operation === 'shipped').length, 1);
        assert.equal(order?.state, 'shipped');
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });
});
