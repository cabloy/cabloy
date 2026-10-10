import type { IPaymentOutcomeEvent, IRefundOutcomeEvent } from 'vona-module-a-pay';
import type { EntityOutboxEvent, EntityWebhookInbox } from 'vona-module-a-pay';

import { randomUUID } from 'node:crypto';

import type { TypeOrderState } from '../entity/order.tsx';
import type { EntityOrderAudit, TypeOrderAuditOperation } from '../entity/orderAudit.tsx';
import type { EntityStockBalance } from '../entity/stockBalance.tsx';
import type { EntityStockReservation } from '../entity/stockReservation.tsx';

export const fixturePrefix = 'e2e-fixture-';

export function createOwnedFixtureName(userId: string | number) {
  return `${fixturePrefix}${userId}-${randomUUID().replaceAll('-', '').slice(0, 12)}`;
}
const mockProvider = 'pay-mock:mock';

export function isOwnedFixtureName(name: string, userId: string | number) {
  return new RegExp(`^${fixturePrefix}${userId}-[0-9a-f]{12}$`).test(name);
}

export function isFixtureCustomer<T extends { name: string; anonymous?: boolean }>(
  user: T | undefined,
): user is T {
  return !!user && !user.anonymous && user.name.startsWith(fixturePrefix);
}

export function fixtureReservationMatchesLine(
  reservation: Pick<
    EntityStockReservation,
    'skuId' | 'orderLineId' | 'stockBalanceId' | 'quantity'
  >,
  line: { id: string | number; skuId: string | number; quantity: number },
  balance: Pick<EntityStockBalance, 'id' | 'skuId'>,
) {
  return (
    String(reservation.orderLineId) === String(line.id) &&
    String(reservation.skuId) === String(line.skuId) &&
    String(reservation.stockBalanceId) === String(balance.id) &&
    String(balance.skuId) === String(line.skuId) &&
    reservation.quantity === line.quantity
  );
}

export function fixtureAdvancedPaymentAuditMatches(
  audits: Pick<
    EntityOrderAudit,
    'id' | 'orderId' | 'operation' | 'fromState' | 'toState' | 'correlationId'
  >[],
  orderId: string | number,
  state: Extract<TypeOrderState, 'shipped' | 'refunded'>,
  paymentCorrelationId: string,
  shipmentCorrelationId?: string,
  refundCorrelationId?: string,
) {
  const expected: Array<{
    operation: TypeOrderAuditOperation;
    fromState: TypeOrderState;
    toState: TypeOrderState;
  }> = [
    { operation: 'paid', fromState: 'awaiting_payment', toState: 'paid' },
    ...(state === 'shipped'
      ? [{ operation: 'shipped' as const, fromState: 'paid' as const, toState: 'shipped' as const }]
      : [
          {
            operation: 'refund_requested' as const,
            fromState: 'paid' as const,
            toState: 'refund_requested' as const,
          },
          {
            operation: 'refund_approved' as const,
            fromState: 'refund_requested' as const,
            toState: 'refund_approved' as const,
          },
          {
            operation: 'refunded' as const,
            fromState: 'refund_approved' as const,
            toState: 'refunded' as const,
          },
        ]),
  ];
  const steps = audits.filter(audit => audit.operation !== 'created');
  return (
    steps.length === expected.length &&
    steps.every(
      (audit, index) =>
        String(audit.orderId) === String(orderId) &&
        audit.operation === expected[index].operation &&
        audit.fromState === expected[index].fromState &&
        audit.toState === expected[index].toState &&
        (index !== 0 || audit.correlationId === paymentCorrelationId) &&
        (state !== 'shipped' || index !== 1 || audit.correlationId === shipmentCorrelationId) &&
        (state !== 'refunded' || index !== 3 || audit.correlationId === refundCorrelationId),
    )
  );
}

export function fixtureEventNeedsDispatch(event: EntityOutboxEvent, now = new Date()) {
  if (event.state === 'dispatched') {
    if (
      !event.dispatchedAt ||
      event.claimToken ||
      event.claimedAt ||
      event.claimExpiresAt ||
      event.errorSummary ||
      event.attemptCount < 1
    ) {
      throw new Error('fixture event has inconsistent dispatched state');
    }
    return false;
  }
  if (
    event.state !== 'pending' ||
    event.attemptCount !== 0 ||
    event.claimToken ||
    event.claimedAt ||
    event.claimExpiresAt ||
    event.dispatchedAt ||
    event.errorSummary ||
    (event.nextAttemptAt && event.nextAttemptAt > now)
  ) {
    throw new Error('fixture event is not eligible for dispatch');
  }
  return true;
}

export function selectFixtureEvent(
  events: EntityOutboxEvent[],
  inboxes: EntityWebhookInbox[],
  expected: {
    kind: 'payment' | 'refund';
    paymentSessionId: string | number;
    businessReference: string;
    amountMinor: number;
    currency: string;
    refundOperationId?: string | number;
    clientName: string;
    environment: 'sandbox' | 'live';
  },
) {
  const eventType = `${expected.kind}.outcome.v1`;
  const candidates = events.filter(
    event =>
      event.eventType === eventType &&
      String(event.paymentSessionId) === String(expected.paymentSessionId) &&
      (expected.kind === 'payment'
        ? !event.refundOperationId
        : String(event.refundOperationId) === String(expected.refundOperationId)),
  );
  if (candidates.length !== 1) throw new Error('fixture outbox event is missing or ambiguous');
  const event = candidates[0];
  const payload = event.payload as IPaymentOutcomeEvent | IRefundOutcomeEvent;
  if (
    typeof payload?.eventId !== 'string' ||
    !payload.eventId.startsWith(`mock-${expected.kind}-`) ||
    String(event.paymentSessionId) !== String(payload.paymentSessionId) ||
    (expected.kind === 'payment'
      ? !!event.refundOperationId
      : String(event.refundOperationId) !==
        String((payload as IRefundOutcomeEvent).refundOperationId)) ||
    payload.providerName !== mockProvider ||
    payload.businessReference !== expected.businessReference ||
    String(payload.paymentSessionId) !== String(expected.paymentSessionId) ||
    payload.amountMinor !== expected.amountMinor ||
    payload.currency !== expected.currency ||
    !['succeeded', 'failed', 'cancelled'].includes(payload.state) ||
    (expected.kind === 'refund' &&
      String((payload as IRefundOutcomeEvent).refundOperationId) !==
        String(expected.refundOperationId))
  ) {
    throw new Error('fixture outbox payload conflicts with the mock operation');
  }
  const matchingInboxes = inboxes.filter(
    inbox =>
      inbox.providerEventId === payload.eventId &&
      inbox.providerName === mockProvider &&
      inbox.clientName === expected.clientName &&
      inbox.environment === expected.environment,
  );
  if (matchingInboxes.length !== 1)
    throw new Error('fixture webhook inbox is missing or ambiguous');
  const inbox = matchingInboxes[0];
  if (
    inbox.state !== 'processed' ||
    !inbox.processedAt ||
    inbox.errorSummary ||
    inbox.eventType !== `${expected.kind}.${payload.state}` ||
    String(inbox.paymentSessionId) !== String(expected.paymentSessionId) ||
    (expected.kind === 'payment'
      ? !!inbox.refundOperationId || inbox.paymentState !== payload.state
      : String(inbox.refundOperationId) !== String(expected.refundOperationId) ||
        inbox.refundState !== payload.state) ||
    inbox.amountMinor !== expected.amountMinor ||
    inbox.currency !== expected.currency ||
    (expected.kind === 'payment' &&
      (inbox.providerCaptureId ?? undefined) !==
        ((payload as IPaymentOutcomeEvent).providerCaptureId ?? undefined)) ||
    (expected.kind === 'refund' &&
      inbox.providerRefundId !== (payload as IRefundOutcomeEvent).providerRefundId)
  ) {
    throw new Error('fixture webhook inbox is not a processed matching terminal outcome');
  }
  return { event, payload };
}

export function selectPaymentFixtureEvent(
  events: EntityOutboxEvent[],
  inboxes: EntityWebhookInbox[],
  expected: Omit<Parameters<typeof selectFixtureEvent>[2], 'kind' | 'refundOperationId'>,
) {
  const result = selectFixtureEvent(events, inboxes, { ...expected, kind: 'payment' });
  return { ...result, payload: result.payload as IPaymentOutcomeEvent };
}

export function selectRefundFixtureEvent(
  events: EntityOutboxEvent[],
  inboxes: EntityWebhookInbox[],
  expected: Omit<Parameters<typeof selectFixtureEvent>[2], 'kind' | 'refundOperationId'> & {
    refundOperationId: string | number;
  },
) {
  const result = selectFixtureEvent(events, inboxes, { ...expected, kind: 'refund' });
  return { ...result, payload: result.payload as IRefundOutcomeEvent };
}
