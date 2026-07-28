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

async function createPaidOrder(fixture: IFixture, suffix: string): Promise<void> {
  fixture.customerName = `shipment-refund-${suffix}`;
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
}

async function runInMockCtx<TResult>(
  customerName: string | undefined,
  operation: () => Promise<TResult>,
): Promise<TResult> {
  return await app.bean.executor.mockCtx(async () => {
    if (customerName === undefined) {
      await app.bean.passport.signinMock();
    } else {
      await app.bean.passport.signinMock(customerName as any);
    }
    try {
      return await operation();
    } finally {
      await app.bean.passport.signout();
    }
  });
}

async function withTimeout<TResult>(promise: Promise<TResult>, message: string): Promise<TResult> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), 5_000);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function waitForHolderStage(
  entered: Promise<void>,
  holder: Promise<unknown>,
  label: string,
): Promise<void> {
  return await withTimeout(
    Promise.race([
      entered,
      holder.then(
        () =>
          Promise.reject(new Error(`${label} completed before reaching its lock-holding stage`)),
        error => Promise.reject(error),
      ),
    ]),
    `${label} did not reach its lock-holding stage`,
  );
}

async function waitForPostgresWaiter(waiterPid: number, holderPid: number): Promise<void> {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const result = await app.bean.database.current.connection.raw(
      `
        select wait_event_type
          from pg_stat_activity
         where pid = ?
           and ? = any(pg_blocking_pids(pid))
      `,
      [waiterPid, holderPid],
    );
    if (result.rows[0]) {
      assert.equal(result.rows[0].wait_event_type, 'Lock');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.fail(`PostgreSQL backend ${waiterPid} was not blocked by backend ${holderPid}`);
}

async function assertPersistedRefundOutcome(
  orderId: number,
  expected: {
    orderState: string;
    refundState: string;
    refundAttemptState: string;
    orderAuditOperations: readonly string[];
    refundAuditStates: readonly string[];
  },
): Promise<void> {
  const trade = app.scope('commerce-trade');
  const payment = app.scope('commerce-payment');
  const order = await trade.model.order.getById(orderId);
  const shipments = await trade.model.shipment.select({ where: { orderId } });
  const requests = await payment.model.refundRequest.select({ where: { orderId } });
  const attempts = await payment.model.refundAttempt.select({
    where: { refundRequestId: requests[0]?.id },
  });
  const orderAudits = await trade.model.orderAudit.select({ where: { orderId } });
  const refundAudits = await payment.model.refundAudit.select({ where: { orderId } });

  assert.equal(order?.state, expected.orderState);
  assert.equal(shipments.length, 0);
  assert.equal(requests.length, 1);
  assert.equal(requests[0]?.state, expected.refundState);
  assert.equal(attempts.length, 1);
  assert.equal(attempts[0]?.state, expected.refundAttemptState);
  for (const operation of expected.orderAuditOperations) {
    assert.equal(orderAudits.filter(item => item.operation === operation).length, 1);
  }
  assert.equal(orderAudits.filter(item => item.operation === 'shipped').length, 0);
  assert.deepEqual(refundAudits.map(item => item.toRefundState).sort(), expected.refundAuditStates);
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
        await createPaidOrder(fixture, randomUUID().slice(0, 12));
      });
      const requestEntered = Promise.withResolvers<void>();
      const releaseRequest = Promise.withResolvers<void>();
      let requestPid: number | undefined;
      const requestRefund = runInMockCtx(fixture.customerName, async () => {
        return await app.scope('commerce-trade').service.order.requestRefundForTest(
          fixture.orderId!,
          {
            reason: 'race request',
            idempotencyKey: 'shipment-refund-race-request-1',
          },
          async stage => {
            if (stage !== 'afterRefundRequestOrderState') return;
            const result = await app.bean.database.current.connection.raw(
              'select pg_backend_pid() as pid',
            );
            requestPid = result.rows[0].pid;
            requestEntered.resolve();
            await releaseRequest.promise;
          },
        );
      });
      const shipmentReady = Promise.withResolvers<void>();
      const releaseShipment = Promise.withResolvers<void>();
      let shipmentPid: number | undefined;
      let ship: Promise<unknown> | undefined;
      try {
        await waitForHolderStage(requestEntered.promise, requestRefund, 'refund request');
        assert.notEqual(requestPid, undefined);
        ship = runInMockCtx(undefined, async () => {
          return await app.scope('commerce-trade').service.order.shipForTest(
            fixture.orderId!,
            {
              carrier: 'Cabloy Express',
              trackingNumber: 'CAB-RFD-1',
            },
            async stage => {
              if (stage !== 'beforeOrderLock') return;
              const result = await app.bean.database.current.connection.raw(
                'select pg_backend_pid() as pid',
              );
              shipmentPid = result.rows[0].pid;
              shipmentReady.resolve();
              await releaseShipment.promise;
            },
          );
        });
        await waitForHolderStage(shipmentReady.promise, ship, 'shipment');
        assert.notEqual(shipmentPid, undefined);
        releaseShipment.resolve();
        await app.bean.executor.mockCtx(async () => {
          await waitForPostgresWaiter(shipmentPid!, requestPid!);
        });
      } finally {
        releaseShipment.resolve();
        releaseRequest.resolve();
        await Promise.allSettled([requestRefund, ship].filter(Boolean));
      }
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

  it('rejects shipment when refund approval contends for the locked refund-requested order', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        await createPaidOrder(fixture, randomUUID().slice(0, 12));
      });
      await runInMockCtx(fixture.customerName, async () => {
        await app.scope('commerce-trade').service.order.requestRefund(fixture.orderId!, {
          reason: 'race approval request',
          idempotencyKey: 'shipment-refund-race-approval-request-1',
        });
      });
      const entered = Promise.withResolvers<void>();
      const release = Promise.withResolvers<void>();
      let holderPid: number | undefined;
      const approveRefund = runInMockCtx(undefined, async () => {
        return await app.scope('commerce-trade').service.order.reviewRefundForTest(
          fixture.orderId!,
          {
            reason: 'race approval',
            idempotencyKey: 'shipment-refund-race-approval-1',
          },
          'approved',
          async stage => {
            if (stage !== 'afterRefundReviewOrderState') return;
            const result = await app.bean.database.current.connection.raw(
              'select pg_backend_pid() as pid',
            );
            holderPid = result.rows[0].pid;
            entered.resolve();
            await release.promise;
          },
        );
      });
      const shipmentReady = Promise.withResolvers<void>();
      const releaseShipment = Promise.withResolvers<void>();
      let shipmentPid: number | undefined;
      let ship: Promise<unknown> | undefined;
      let results: PromiseSettledResult<unknown>[] | undefined;
      try {
        await waitForHolderStage(entered.promise, approveRefund, 'refund approval');
        assert.notEqual(holderPid, undefined);
        ship = runInMockCtx(undefined, async () => {
          return await app.scope('commerce-trade').service.order.shipForTest(
            fixture.orderId!,
            {
              carrier: 'Cabloy Express',
              trackingNumber: 'CAB-RFD-APPROVAL-1',
            },
            async stage => {
              if (stage !== 'beforeOrderLock') return;
              const result = await app.bean.database.current.connection.raw(
                'select pg_backend_pid() as pid',
              );
              shipmentPid = result.rows[0].pid;
              shipmentReady.resolve();
              await releaseShipment.promise;
            },
          );
        });
        await waitForHolderStage(shipmentReady.promise, ship, 'shipment');
        assert.notEqual(shipmentPid, undefined);
        releaseShipment.resolve();
        await app.bean.executor.mockCtx(async () => {
          await waitForPostgresWaiter(shipmentPid!, holderPid!);
        });
      } finally {
        releaseShipment.resolve();
        release.resolve();
        results = await Promise.allSettled([approveRefund, ship].filter(Boolean));
      }
      const [approvalResult, shipmentResult] = results!;
      const message = JSON.stringify(results);
      assert.equal(approvalResult.status, 'fulfilled', message);
      assert.equal(shipmentResult.status, 'rejected', message);
      if (approvalResult.status !== 'fulfilled' || shipmentResult.status !== 'rejected') return;
      assert.deepEqual(
        [
          approvalResult.value.orderState,
          approvalResult.value.refundState,
          approvalResult.value.refundAttemptState,
        ],
        ['refund_approved', 'approved', 'created'],
      );
      assert.equal(shipmentResult.reason?.code, 409);
      await app.bean.executor.mockCtx(async () => {
        await assertPersistedRefundOutcome(fixture.orderId!, {
          orderState: 'refund_approved',
          refundState: 'approved',
          refundAttemptState: 'created',
          orderAuditOperations: ['refund_requested', 'refund_approved'],
          refundAuditStates: ['approved', 'requested'],
        });
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });

  it('rejects shipment when successful refund execution contends for the locked approved order', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    try {
      await app.bean.executor.mockCtx(async () => {
        await createPaidOrder(fixture, randomUUID().slice(0, 12));
      });
      await runInMockCtx(fixture.customerName, async () => {
        await app.scope('commerce-trade').service.order.requestRefund(fixture.orderId!, {
          reason: 'race execution request',
          idempotencyKey: 'shipment-refund-race-execution-request-1',
        });
      });
      await runInMockCtx(undefined, async () => {
        await app.scope('commerce-trade').service.order.approveRefund(fixture.orderId!, {
          reason: 'race execution approval',
          idempotencyKey: 'shipment-refund-race-execution-approval-1',
        });
      });
      const entered = Promise.withResolvers<void>();
      const release = Promise.withResolvers<void>();
      let holderPid: number | undefined;
      const executeRefund = runInMockCtx(undefined, async () => {
        return await app.scope('commerce-trade').service.order.applyRefundOutcomeForTest(
          fixture.orderId!,
          {
            outcome: 'succeeded',
            idempotencyKey: 'shipment-refund-race-execution-outcome-1',
          },
          async stage => {
            if (stage !== 'afterRefundOutcomeOrderState') return;
            const result = await app.bean.database.current.connection.raw(
              'select pg_backend_pid() as pid',
            );
            holderPid = result.rows[0].pid;
            entered.resolve();
            await release.promise;
          },
        );
      });
      const shipmentReady = Promise.withResolvers<void>();
      const releaseShipment = Promise.withResolvers<void>();
      let shipmentPid: number | undefined;
      let ship: Promise<unknown> | undefined;
      let results: PromiseSettledResult<unknown>[] | undefined;
      try {
        await waitForHolderStage(entered.promise, executeRefund, 'refund execution');
        assert.notEqual(holderPid, undefined);
        ship = runInMockCtx(undefined, async () => {
          return await app.scope('commerce-trade').service.order.shipForTest(
            fixture.orderId!,
            {
              carrier: 'Cabloy Express',
              trackingNumber: 'CAB-RFD-EXECUTION-1',
            },
            async stage => {
              if (stage !== 'beforeOrderLock') return;
              const result = await app.bean.database.current.connection.raw(
                'select pg_backend_pid() as pid',
              );
              shipmentPid = result.rows[0].pid;
              shipmentReady.resolve();
              await releaseShipment.promise;
            },
          );
        });
        await waitForHolderStage(shipmentReady.promise, ship, 'shipment');
        assert.notEqual(shipmentPid, undefined);
        releaseShipment.resolve();
        await app.bean.executor.mockCtx(async () => {
          await waitForPostgresWaiter(shipmentPid!, holderPid!);
        });
      } finally {
        releaseShipment.resolve();
        release.resolve();
        results = await Promise.allSettled([executeRefund, ship].filter(Boolean));
      }
      const [refundResult, shipmentResult] = results!;
      const message = JSON.stringify(results);
      assert.equal(refundResult.status, 'fulfilled', message);
      assert.equal(shipmentResult.status, 'rejected', message);
      if (refundResult.status !== 'fulfilled' || shipmentResult.status !== 'rejected') return;
      assert.deepEqual(
        [
          refundResult.value.orderState,
          refundResult.value.refundState,
          refundResult.value.refundAttemptState,
        ],
        ['refunded', 'refunded', 'succeeded'],
      );
      assert.equal(shipmentResult.reason?.code, 409);
      await app.bean.executor.mockCtx(async () => {
        await assertPersistedRefundOutcome(fixture.orderId!, {
          orderState: 'refunded',
          refundState: 'refunded',
          refundAttemptState: 'succeeded',
          orderAuditOperations: ['refund_requested', 'refund_approved', 'refunded'],
          refundAuditStates: ['approved', 'refunded', 'requested'],
        });
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });
});
