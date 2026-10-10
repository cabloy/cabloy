import type { EntityOutboxEvent, EntityWebhookInbox } from 'vona-module-a-pay';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createOwnedFixtureName,
  fixtureAdvancedPaymentAuditMatches,
  fixtureEventNeedsDispatch,
  fixtureReservationMatchesLine,
  isFixtureCustomer,
  isOwnedFixtureName,
  selectPaymentFixtureEvent,
  selectRefundFixtureEvent,
} from '../src/lib/e2eFixture.ts';

const eventId = 'mock-payment-owned';
const payment = {
  eventId,
  paymentSessionId: 101,
  businessReference: '201', // Basic points to payment attempt, not the order.
  providerName: 'pay-mock:mock',
  state: 'succeeded',
  providerCaptureId: 'mock-capture-owned',
  amountMinor: 4599,
  currency: 'USD',
} as const;
const expected = {
  paymentSessionId: 101,
  businessReference: '201',
  amountMinor: 4599,
  currency: 'USD',
  clientName: 'default',
  environment: 'sandbox',
} as const;

function event(overrides: Record<string, unknown> = {}): EntityOutboxEvent {
  return {
    id: 301,
    paymentSessionId: 101,
    eventType: 'payment.outcome.v1',
    payload: payment,
    state: 'pending',
    attemptCount: 0,
    nextAttemptAt: new Date(0),
    ...overrides,
  } as EntityOutboxEvent;
}

function inbox(overrides: Record<string, unknown> = {}): EntityWebhookInbox {
  return {
    id: 401,
    paymentSessionId: 101,
    providerEventId: eventId,
    providerName: 'pay-mock:mock',
    clientName: 'default',
    environment: 'sandbox',
    eventType: 'payment.succeeded',
    paymentState: 'succeeded',
    amountMinor: 4599,
    currency: 'USD',
    providerCaptureId: 'mock-capture-owned',
    payloadHash: 'a'.repeat(64),
    state: 'processed',
    retryCount: 0,
    processedAt: new Date(),
    ...overrides,
  } as EntityWebhookInbox;
}

function selectPayment(events = [event()], inboxes = [inbox()]) {
  return selectPaymentFixtureEvent(events, inboxes, expected);
}

describe('owned Commerce E2E webhook fixture selection', { concurrency: false }, () => {
  it('requires a generated Admin-owned fixture name and the exact payment attempt relationship', () => {
    const generatedName = createOwnedFixtureName(123);
    assert.match(generatedName, /^e2e-fixture-123-[0-9a-f]{12}$/);
    assert.equal(isOwnedFixtureName(generatedName, 123), true);
    assert.equal(isOwnedFixtureName(generatedName, 12), false);
    assert.equal(isOwnedFixtureName('e2e-fixture-123-a1b2c3d4e5f6', 123), true);
    assert.equal(isOwnedFixtureName('e2e-fixture-123-a1b2c3d4e5f6', 12), false);
    assert.equal(isOwnedFixtureName('e2e-fixture-123-invalid', 123), false);
    assert.equal(isFixtureCustomer(undefined), false);
    assert.equal(
      isFixtureCustomer({ id: 123, name: 'e2e-fixture-customer', anonymous: true }),
      false,
    );
    assert.equal(isFixtureCustomer({ id: 123, name: 'ordinary', anonymous: false }), false);
    assert.equal(
      isFixtureCustomer({ id: 123, name: 'e2e-fixture-customer', anonymous: false }),
      true,
    );
    assert.equal(selectPayment().payload.businessReference, '201');
    assert.throws(
      () =>
        selectPaymentFixtureEvent([event()], [inbox()], {
          ...expected,
          businessReference: '202',
        }),
      /payload conflicts/,
    );
    assert.throws(
      () => selectPayment([event({ payload: { ...payment, providerName: 'pay-paypal:paypal' } })]),
      /payload conflicts/,
    );
    assert.throws(() => selectPayment([event({ paymentSessionId: 102 })]), /missing or ambiguous/);
    assert.throws(
      () => selectPayment([event({ payload: { ...payment, paymentSessionId: 102 } })]),
      /payload conflicts/,
    );
    assert.throws(() => selectPayment([event({ refundOperationId: 501 })]), /missing or ambiguous/);
  });

  it('rejects missing and ambiguous outbox events or processed inboxes', () => {
    assert.throws(() => selectPayment([]), /missing or ambiguous/);
    assert.throws(() => selectPayment([event(), event({ id: 302 })]), /missing or ambiguous/);
    assert.throws(() => selectPayment([event()], []), /missing or ambiguous/);
    assert.throws(
      () => selectPayment([event()], [inbox(), inbox({ id: 402 })]),
      /missing or ambiguous/,
    );
    assert.throws(
      () => selectPayment([event()], [inbox({ state: 'received' })]),
      /processed matching/,
    );
    assert.throws(
      () => selectPayment([event()], [inbox({ errorSummary: 'ignored' })]),
      /processed matching/,
    );
    assert.throws(
      () => selectPayment([event()], [inbox({ providerCaptureId: 'other' })]),
      /processed matching/,
    );
  });

  it('accepts a missing capture for cancelled and failed payments without accepting a conflicting capture', () => {
    for (const state of ['cancelled', 'failed'] as const) {
      const outcome = { ...payment, state, providerCaptureId: undefined };
      const outcomeEvent = event({ payload: outcome });
      const outcomeInbox = inbox({
        eventType: `payment.${state}`,
        paymentState: state,
        providerCaptureId: null,
      });
      assert.equal(selectPayment([outcomeEvent], [outcomeInbox]).payload.state, state);
      assert.throws(
        () =>
          selectPayment([outcomeEvent], [inbox({ ...outcomeInbox, providerCaptureId: 'other' })]),
        /processed matching/,
      );
      assert.throws(
        () => selectPayment([event({ payload: { ...payment, state } })], [outcomeInbox]),
        /processed matching/,
      );
    }
  });

  it('requires the refund attempt, mock operation, inbox and outbox to agree', () => {
    const refund = {
      eventId: 'mock-refund-owned',
      paymentSessionId: 101,
      refundOperationId: 501,
      businessReference: '601',
      providerName: 'pay-mock:mock',
      state: 'cancelled',
      providerRefundId: 'mock-refund-owned',
      amountMinor: 4599,
      currency: 'USD',
    } as const;
    const refundEvent = event({
      eventType: 'refund.outcome.v1',
      refundOperationId: 501,
      payload: refund,
    });
    const refundInbox = inbox({
      providerEventId: refund.eventId,
      eventType: 'refund.cancelled',
      refundOperationId: 501,
      refundState: 'cancelled',
      paymentState: undefined,
      providerRefundId: refund.providerRefundId,
    });
    const select = (events = [refundEvent], inboxes = [refundInbox]) =>
      selectRefundFixtureEvent(events, inboxes, {
        ...expected,
        refundOperationId: 501,
        businessReference: '601',
      });
    assert.equal(select().payload.state, 'cancelled');
    assert.throws(
      () => select([event({ ...refundEvent, refundOperationId: 502 })]),
      /missing or ambiguous/,
    );
    assert.throws(
      () => select([event({ ...refundEvent, payload: { ...refund, refundOperationId: 502 } })]),
      /payload conflicts/,
    );
    assert.throws(
      () => select([refundEvent], [inbox({ ...refundInbox, refundOperationId: 502 })]),
      /processed matching/,
    );
    assert.throws(
      () => select([event({ ...refundEvent, payload: { ...refund, businessReference: '602' } })]),
      /payload conflicts/,
    );
    assert.throws(
      () => select([refundEvent, event({ ...refundEvent, id: 302 })]),
      /missing or ambiguous/,
    );
  });

  it('requires reservation and balance identities before deleting owned stock', () => {
    const line = { id: 10, skuId: 20, quantity: 1 };
    const balance = { id: 30, skuId: 20 };
    const reservation = { orderLineId: 10, skuId: 20, stockBalanceId: 30, quantity: 1 };
    assert.equal(fixtureReservationMatchesLine(reservation, line, balance), true);
    for (const mismatch of [
      { orderLineId: 11 },
      { skuId: 21 },
      { stockBalanceId: 31 },
      { quantity: 2 },
    ]) {
      assert.equal(
        fixtureReservationMatchesLine({ ...reservation, ...mismatch }, line, balance),
        false,
      );
    }
    assert.equal(fixtureReservationMatchesLine(reservation, line, { id: 30, skuId: 21 }), false);
  });

  it('accepts only the exact persisted payment-to-shipment or payment-to-refund audit chain', () => {
    const paid = {
      id: 10,
      orderId: 1,
      operation: 'paid' as const,
      fromState: 'awaiting_payment' as const,
      toState: 'paid' as const,
      correlationId: 'payment-owned',
    };
    const shipped = {
      id: 11,
      orderId: 1,
      operation: 'shipped' as const,
      fromState: 'paid' as const,
      toState: 'shipped' as const,
      correlationId: 'shipment-owned',
    };
    const requested = {
      id: 11,
      orderId: 1,
      operation: 'refund_requested' as const,
      fromState: 'paid' as const,
      toState: 'refund_requested' as const,
      correlationId: 'request-owned',
    };
    const approved = {
      id: 12,
      orderId: 1,
      operation: 'refund_approved' as const,
      fromState: 'refund_requested' as const,
      toState: 'refund_approved' as const,
      correlationId: 'approval-owned',
    };
    const refunded = {
      id: 13,
      orderId: 1,
      operation: 'refunded' as const,
      fromState: 'refund_approved' as const,
      toState: 'refunded' as const,
      correlationId: 'refund-owned',
    };
    const shippedAudits = [paid, shipped];
    const refundedAudits = [paid, requested, approved, refunded];
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        shippedAudits,
        1,
        'shipped',
        'payment-owned',
        'shipment-owned',
      ),
      true,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        refundedAudits,
        1,
        'refunded',
        'payment-owned',
        undefined,
        'refund-owned',
      ),
      true,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        shippedAudits,
        2,
        'shipped',
        'payment-owned',
        'shipment-owned',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        shippedAudits,
        1,
        'shipped',
        'other-payment',
        'shipment-owned',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        shippedAudits,
        1,
        'shipped',
        'payment-owned',
        'other-shipment',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        refundedAudits,
        1,
        'refunded',
        'payment-owned',
        undefined,
        'other-refund',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        [paid, { ...requested, fromState: 'awaiting_payment' }, approved, refunded],
        1,
        'refunded',
        'payment-owned',
        undefined,
        'refund-owned',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        [paid, requested, approved, { ...refunded, orderId: 2 }],
        1,
        'refunded',
        'payment-owned',
        undefined,
        'refund-owned',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        [paid, requested, approved],
        1,
        'refunded',
        'payment-owned',
        undefined,
        'refund-owned',
      ),
      false,
    );
    assert.equal(
      fixtureAdvancedPaymentAuditMatches(
        [paid, shipped, requested],
        1,
        'shipped',
        'payment-owned',
        'shipment-owned',
      ),
      false,
    );
  });

  it('allows only first-time eligible dispatch and consistent settled replays', () => {
    assert.equal(fixtureEventNeedsDispatch(event()), true);
    assert.equal(
      fixtureEventNeedsDispatch(
        event({ state: 'dispatched', dispatchedAt: new Date(), attemptCount: 1 }),
      ),
      false,
    );
    for (const state of ['claimed', 'failed'] as const) {
      assert.throws(() => fixtureEventNeedsDispatch(event({ state })), /not eligible/);
    }
    assert.throws(
      () => fixtureEventNeedsDispatch(event({ state: 'pending', attemptCount: 1 })),
      /not eligible/,
    );
    assert.throws(
      () =>
        fixtureEventNeedsDispatch(event({ state: 'pending', errorSummary: 'settlement failed' })),
      /not eligible/,
    );
    assert.throws(
      () => fixtureEventNeedsDispatch(event({ nextAttemptAt: new Date(Date.now() + 60_000) })),
      /not eligible/,
    );
    assert.throws(
      () => fixtureEventNeedsDispatch(event({ state: 'dispatched' })),
      /inconsistent dispatched/,
    );
    for (const stale of [
      { claimToken: 'busy' },
      { claimedAt: new Date() },
      { claimExpiresAt: new Date() },
      { errorSummary: 'failure' },
      { attemptCount: 0 },
    ]) {
      assert.throws(
        () =>
          fixtureEventNeedsDispatch(
            event({ state: 'dispatched', dispatchedAt: new Date(), attemptCount: 1, ...stale }),
          ),
        /inconsistent dispatched/,
      );
    }
    assert.throws(
      () => fixtureEventNeedsDispatch(event({ state: 'pending', claimExpiresAt: new Date() })),
      /not eligible/,
    );
    assert.throws(
      () => fixtureEventNeedsDispatch(event({ state: 'pending', dispatchedAt: new Date() })),
      /not eligible/,
    );
  });
});
