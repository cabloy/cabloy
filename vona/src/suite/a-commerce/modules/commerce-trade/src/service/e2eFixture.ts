import type { TableIdentity } from 'table-identity';
import type { EntityOutboxEvent, IPaymentOutcomeEvent } from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import {
  createOwnedFixtureName,
  fixtureAdvancedPaymentAuditMatches,
  fixtureEventNeedsDispatch,
  fixtureReservationMatchesLine,
  isFixtureCustomer,
  isOwnedFixtureName,
  selectPaymentFixtureEvent,
  selectRefundFixtureEvent,
} from '../lib/e2eFixture.ts';
import { compactProviderReference } from '../lib/providerReference.ts';

const mockProvider = 'pay-mock:mock';

@Service()
export class ServiceE2eFixture extends BeanBase {
  private _ownerId() {
    if (!this.app.meta.isTest && !this.app.meta.isDev) this.app.throw(404);
    const user = this.bean.passport.currentUser;
    if (!isFixtureCustomer(user)) this.app.throw(403);
    return user.id;
  }

  private async _operatorId() {
    if (!this.app.meta.isTest && !this.app.meta.isDev) this.app.throw(404);
    const user = this.bean.passport.currentUser;
    if (!user || user.anonymous || !(await this.bean.passport.isSystemAdmin())) this.app.throw(403);
    return user.id;
  }

  // Published stock is created and removed by the same Admin identity; settlement
  // and order deletion require the owning synthetic customer identity separately.
  @Core.transaction()
  async createCatalogue() {
    const userId = await this._operatorId();
    const name = createOwnedFixtureName(userId);
    const category = await this.$scope.commerceCatalog.model.category.insert({
      name,
      published: true,
    });
    const product = await this.$scope.commerceCatalog.model.product.insert({
      categoryId: category.id,
      title: name,
      published: true,
    });
    const sku = await this.$scope.commerceCatalog.model.sku.insert({
      productId: product.id,
      code: name,
      priceCents: 4599,
      attributes: [],
      lifecycle: 'active',
    });
    const stock = await this.scope.service.stockBalance.adjustStock({
      skuId: sku.id,
      delta: 10,
      reason: 'owned E2E catalogue fixture',
      correlationId: name,
    });
    return {
      categoryId: category.id,
      productId: product.id,
      skuId: sku.id,
      stockBalanceId: stock.id,
      title: product.title,
      code: sku.code,
      initialStock: stock.onHand,
    };
  }

  private async _order(orderId: TableIdentity) {
    const userId = this._ownerId();
    const order = await this.scope.model.order.get({ id: orderId, userId });
    if (!order) this.app.throw(404, 'owned E2E order not found');
    // Require an order line from a synthetic, published catalogue fixture; a
    // fixture account cannot use this endpoint to dispatch real order events.
    const lines = await this.scope.model.orderLine.select({ where: { orderId: order.id } });
    if (
      lines.length !== 1 ||
      lines[0].quantity !== 1 ||
      order.couponSnapshot ||
      order.currency !== 'USD' ||
      order.payableTotalCents !== 4599 ||
      lines[0].skuCodeSnapshot !== lines[0].titleSnapshot ||
      lines[0].unitPriceCents !== 4599
    ) {
      this.app.throw(409, 'E2E order must contain one owned fixture item');
    }
    const sku = await this.$scope.commerceCatalog.model.sku.getById(lines[0].skuId);
    const product = sku && (await this.$scope.commerceCatalog.model.product.getById(sku.productId));
    const category =
      product && (await this.$scope.commerceCatalog.model.category.getById(product.categoryId));
    if (
      !sku ||
      !product ||
      !category ||
      !/^e2e-fixture-\d+-[0-9a-f]{12}$/.test(category.name) ||
      sku.code !== category.name ||
      product.title !== category.name ||
      lines[0].skuCodeSnapshot !== sku.code ||
      lines[0].titleSnapshot !== product.title ||
      String(lines[0].productId) !== String(product.id) ||
      sku.priceCents !== 4599 ||
      sku.lifecycle !== 'active' ||
      !product.published ||
      !category.published ||
      !(await this.$scope.commerceMember.model.address.get({ id: order.addressId, userId }))
    ) {
      this.app.throw(409, 'order does not use a synthetic E2E catalogue');
    }
    const allLines = await this.scope.model.orderLine.select({ where: { skuId: sku.id } });
    if (allLines.length !== 1 || String(allLines[0].id) !== String(lines[0].id)) {
      this.app.throw(409, 'E2E SKU is not exclusively owned by this order');
    }
    return order;
  }

  private async _session(paymentSessionId: TableIdentity, userId: TableIdentity) {
    const session = await this.$scope.pay.model.paymentSession.getById(paymentSessionId);
    if (
      !session ||
      String(session.userId) !== String(userId) ||
      session.providerName !== mockProvider ||
      session.clientName !== 'default' ||
      session.environment !== 'sandbox' ||
      session.payScene !== 'commerce-payment:commerceOrder'
    ) {
      this.app.throw(409, 'E2E payment session is not owned mock Commerce payment');
    }
    return session;
  }

  async dispatchPayment(orderId: TableIdentity, attemptId: TableIdentity) {
    const order = await this._order(orderId);
    const attempt = await this.$scope.commercePayment.model.paymentAttempt.getById(attemptId);
    if (
      !attempt?.paymentSessionId ||
      String(attempt.orderId) !== String(order.id) ||
      String(attempt.userId) !== String(order.userId)
    ) {
      this.app.throw(404, 'owned E2E payment attempt not found');
    }
    const session = await this._session(attempt.paymentSessionId, order.userId);
    if (
      session.businessReference !== String(attempt.id) ||
      session.amountMinor !== attempt.amountCents ||
      session.currency !== attempt.currency ||
      attempt.amountCents !== order.payableTotalCents ||
      attempt.currency !== order.currency ||
      session.providerName !== attempt.providerName ||
      !['succeeded', 'failed', 'cancelled'].includes(session.state)
    ) {
      this.app.throw(409, 'E2E payment facts are inconsistent');
    }
    const events = await this.$scope.pay.model.outboxEvent.select({
      where: { paymentSessionId: session.id, eventType: 'payment.outcome.v1' },
    });
    const inboxes = await this.$scope.pay.model.webhookInbox.select({
      where: { paymentSessionId: session.id },
    });
    const { event, payload } = this._matchPaymentEvent(events, inboxes, {
      paymentSessionId: session.id,
      businessReference: String(attempt.id),
      amountMinor: attempt.amountCents,
      currency: attempt.currency,
      clientName: session.clientName,
      environment: session.environment,
    });
    if (payload.state !== session.state || payload.providerCaptureId !== session.providerCaptureId)
      this.app.throw(409, 'payment webhook outcome conflicts with session');
    const needsDispatch = this._needsDispatch(event);
    if (needsDispatch) {
      if (attempt.state !== 'created' || order.state !== 'awaiting_payment')
        this.app.throw(409, 'payment event cannot be dispatched');
      await this.$scope.pay.queue.outboxDispatch.execute({ outboxEventId: event.id });
    }
    const currentEvent = await this.$scope.pay.model.outboxEvent.getById(event.id);
    const currentOrder = await this.scope.model.order.getById(order.id);
    const currentAttempt = await this.$scope.commercePayment.model.paymentAttempt.getById(
      attempt.id,
    );
    const finalOrderState = payload.state === 'succeeded' ? 'paid' : 'cancelled';
    const line = await this.scope.model.orderLine.get({ orderId: order.id });
    const reservation =
      line && (await this.scope.model.stockReservation.get({ orderLineId: line.id }));
    const balance = line && (await this.scope.model.stockBalance.get({ skuId: line.skuId }));
    const consumed = payload.state === 'succeeded';
    if (
      currentEvent?.state !== 'dispatched' ||
      currentAttempt?.state !== payload.state ||
      currentAttempt.providerCaptureId !== payload.providerCaptureId ||
      !currentOrder ||
      (currentOrder.state !== finalOrderState &&
        (needsDispatch ||
          payload.state !== 'succeeded' ||
          (currentOrder.state !== 'shipped' && currentOrder.state !== 'refunded') ||
          !(await this._advancedPaymentReplayMatches(
            order,
            attempt.id,
            payload,
            currentOrder.state,
          )))) ||
      !reservation ||
      !line ||
      !balance ||
      !fixtureReservationMatchesLine(reservation, line, balance) ||
      reservation.state !==
        (currentOrder?.state === 'refunded' && !needsDispatch
          ? 'restored'
          : consumed
            ? 'consumed'
            : 'released') ||
      balance.reserved !== 0 ||
      balance.onHand !==
        (currentOrder?.state === 'refunded' && !needsDispatch
          ? 10
          : consumed
            ? 10 - reservation!.quantity
            : 10) ||
      balance.available !== balance.onHand
    ) {
      this.app.throw(409, 'payment event did not durably settle the Commerce order');
    }
    return {
      orderId: order.id,
      orderState: currentOrder.state,
      attemptState: currentAttempt.state,
      stock: balance.available,
    };
  }

  private async _advancedPaymentReplayMatches(
    order: { id: TableIdentity; userId: TableIdentity; correlationId: string },
    paymentAttemptId: TableIdentity,
    payload: IPaymentOutcomeEvent,
    state: 'shipped' | 'refunded',
  ) {
    const payment = this.$scope.commercePayment;
    const paymentAudits = await payment.model.paymentAudit.select({
      where: { paymentAttemptId },
    });
    if (
      paymentAudits.length !== 1 ||
      String(paymentAudits[0].orderId) !== String(order.id) ||
      String(paymentAudits[0].userId) !== String(order.userId) ||
      paymentAudits[0].provider !== mockProvider ||
      paymentAudits[0].providerEventId !== payload.eventId ||
      paymentAudits[0].outcome !== 'succeeded' ||
      paymentAudits[0].fromAttemptState !== 'created' ||
      paymentAudits[0].toOrderState !== 'paid' ||
      paymentAudits[0].reason !== 'provider payment succeeded' ||
      paymentAudits[0].idempotencyKey !==
        compactProviderReference('payment-event', payload.eventId, 100) ||
      paymentAudits[0].correlationId !==
        compactProviderReference(
          'payment-correlation',
          `${order.correlationId}:provider:${payload.eventId}`,
          93,
        ) ||
      !paymentAudits[0].processedAt
    ) {
      return false;
    }
    const orderAudits = await this.scope.model.orderAudit.select({
      where: { orderId: order.id },
      orders: [['id', 'asc']],
    });
    const shipment = await this.scope.model.shipment.get({ orderId: order.id });
    if (state === 'shipped') {
      return (
        !!shipment &&
        String(shipment.orderId) === String(order.id) &&
        shipment.correlationId === `${order.correlationId}:shipment` &&
        !!shipment.shippedAt &&
        fixtureAdvancedPaymentAuditMatches(
          orderAudits,
          order.id,
          state,
          paymentAudits[0].correlationId,
          shipment.correlationId,
        )
      );
    }
    if (shipment) return false;
    const requests = await payment.model.refundRequest.select({ where: { orderId: order.id } });
    const attempts = await payment.model.refundAttempt.select({ where: { orderId: order.id } });
    if (
      requests.length !== 1 ||
      attempts.length !== 1 ||
      String(requests[0].userId) !== String(order.userId) ||
      String(attempts[0].userId) !== String(order.userId) ||
      String(attempts[0].refundRequestId) !== String(requests[0].id) ||
      !attempts[0].refundOperationId ||
      requests[0].state !== 'refunded' ||
      attempts[0].state !== 'succeeded' ||
      requests[0].amountCents !== 4599 ||
      attempts[0].amountCents !== requests[0].amountCents ||
      requests[0].currency !== 'USD' ||
      attempts[0].currency !== requests[0].currency
    ) {
      return false;
    }
    const operation = await this.$scope.pay.model.refundOperation.getById(
      attempts[0].refundOperationId,
    );
    if (
      !operation ||
      String(operation.paymentSessionId) !== String(payload.paymentSessionId) ||
      operation.businessReference !== String(attempts[0].id) ||
      operation.state !== 'succeeded' ||
      operation.providerRefundId !== attempts[0].providerRefundId ||
      operation.amountMinor !== attempts[0].amountCents ||
      operation.currency !== attempts[0].currency
    ) {
      return false;
    }
    const refundEvents = await this.$scope.pay.model.outboxEvent.select({
      where: { paymentSessionId: payload.paymentSessionId, eventType: 'refund.outcome.v1' },
    });
    const inboxes = await this.$scope.pay.model.webhookInbox.select({
      where: { paymentSessionId: payload.paymentSessionId, refundOperationId: operation.id },
    });
    let refundEvent: EntityOutboxEvent;
    let refundPayload: ReturnType<typeof selectRefundFixtureEvent>['payload'];
    try {
      ({ event: refundEvent, payload: refundPayload } = selectRefundFixtureEvent(
        refundEvents,
        inboxes,
        {
          paymentSessionId: payload.paymentSessionId,
          refundOperationId: operation.id,
          businessReference: String(attempts[0].id),
          amountMinor: attempts[0].amountCents,
          currency: attempts[0].currency,
          clientName: 'default',
          environment: 'sandbox',
        },
      ));
      if (fixtureEventNeedsDispatch(refundEvent)) return false;
    } catch {
      return false;
    }
    const refundAudits = await payment.model.refundAudit.select({
      where: { refundRequestId: requests[0].id },
    });
    const finalAudit = refundAudits.find(audit => audit.toRefundState === 'refunded');
    if (
      refundAudits.length !== 3 ||
      !finalAudit ||
      String(finalAudit.refundAttemptId) !== String(attempts[0].id) ||
      String(finalAudit.orderId) !== String(order.id) ||
      String(finalAudit.userId) !== String(order.userId) ||
      finalAudit.attemptState !== 'succeeded' ||
      !finalAudit.processedAt ||
      refundPayload.state !== 'succeeded' ||
      refundPayload.providerRefundId !== operation.providerRefundId
    ) {
      return false;
    }
    const refundCorrelationId = compactProviderReference(
      'refund-correlation',
      `${order.correlationId}:provider-refund:${refundPayload.eventId}`,
      100,
    );
    return (
      finalAudit.correlationId === refundCorrelationId &&
      fixtureAdvancedPaymentAuditMatches(
        orderAudits,
        order.id,
        state,
        paymentAudits[0].correlationId,
        undefined,
        refundCorrelationId,
      )
    );
  }

  async dispatchRefund(orderId: TableIdentity, attemptId: TableIdentity) {
    const order = await this._order(orderId);
    const attempt = await this.$scope.commercePayment.model.refundAttempt.getById(attemptId);
    if (
      !attempt?.refundOperationId ||
      String(attempt.orderId) !== String(order.id) ||
      String(attempt.userId) !== String(order.userId)
    ) {
      this.app.throw(404, 'owned E2E refund attempt not found');
    }
    const request = await this.$scope.commercePayment.model.refundRequest.getById(
      attempt.refundRequestId,
    );
    if (
      !request ||
      String(request.orderId) !== String(order.id) ||
      String(request.userId) !== String(order.userId) ||
      request.amountCents !== attempt.amountCents ||
      request.currency !== attempt.currency
    ) {
      this.app.throw(409, 'E2E refund request facts are inconsistent');
    }
    const refund = await this.$scope.pay.model.refundOperation.getById(attempt.refundOperationId);
    if (!refund) this.app.throw(404, 'E2E refund operation not found');
    const session = await this._session(refund.paymentSessionId, order.userId);
    const paymentAttempt = await this.$scope.commercePayment.model.paymentAttempt.get({
      orderId: order.id,
    });
    if (
      !paymentAttempt ||
      String(paymentAttempt.paymentSessionId) !== String(session.id) ||
      paymentAttempt.state !== 'succeeded' ||
      String(paymentAttempt.userId) !== String(order.userId) ||
      session.businessReference !== String(paymentAttempt.id) ||
      session.state !== 'succeeded' ||
      session.providerCaptureId === undefined ||
      session.amountMinor !== paymentAttempt.amountCents ||
      session.currency !== paymentAttempt.currency ||
      session.providerName !== paymentAttempt.providerName ||
      refund.businessReference !== String(attempt.id) ||
      refund.amountMinor !== attempt.amountCents ||
      refund.currency !== attempt.currency ||
      attempt.amountCents !== order.payableTotalCents ||
      attempt.currency !== order.currency ||
      !['succeeded', 'failed', 'cancelled'].includes(refund.state)
    ) {
      this.app.throw(409, 'E2E refund operation facts are inconsistent');
    }
    const events = await this.$scope.pay.model.outboxEvent.select({
      where: { paymentSessionId: session.id, eventType: 'refund.outcome.v1' },
    });
    const inboxes = await this.$scope.pay.model.webhookInbox.select({
      where: { paymentSessionId: session.id, refundOperationId: refund.id },
    });
    const { event, payload } = this._matchRefundEvent(events, inboxes, {
      paymentSessionId: session.id,
      refundOperationId: refund.id,
      businessReference: String(attempt.id),
      amountMinor: attempt.amountCents,
      currency: attempt.currency,
      clientName: session.clientName,
      environment: session.environment,
    });
    if (payload.state !== refund.state || payload.providerRefundId !== refund.providerRefundId)
      this.app.throw(409, 'refund webhook outcome conflicts with operation');
    if (this._needsDispatch(event)) {
      if (
        attempt.state !== 'created' ||
        request.state !== 'approved' ||
        order.state !== 'refund_approved'
      ) {
        this.app.throw(409, 'refund event cannot be dispatched');
      }
      await this.$scope.pay.queue.outboxDispatch.execute({ outboxEventId: event.id });
    }
    const currentEvent = await this.$scope.pay.model.outboxEvent.getById(event.id);
    const currentOrder = await this.scope.model.order.getById(order.id);
    const currentAttempt = await this.$scope.commercePayment.model.refundAttempt.getById(
      attempt.id,
    );
    const currentRequest = await this.$scope.commercePayment.model.refundRequest.getById(
      request.id,
    );
    const succeeded = payload.state === 'succeeded';
    const line = await this.scope.model.orderLine.get({ orderId: order.id });
    const reservation =
      line && (await this.scope.model.stockReservation.get({ orderLineId: line.id }));
    const balance = line && (await this.scope.model.stockBalance.get({ skuId: line.skuId }));
    if (
      currentEvent?.state !== 'dispatched' ||
      currentAttempt?.state !== (succeeded ? 'succeeded' : 'failed') ||
      currentAttempt.providerRefundId !== payload.providerRefundId ||
      currentRequest?.state !== (succeeded ? 'refunded' : 'failed') ||
      currentOrder?.state !== (succeeded ? 'refunded' : 'paid') ||
      !reservation ||
      !line ||
      !balance ||
      !fixtureReservationMatchesLine(reservation, line, balance) ||
      reservation.state !== (succeeded ? 'restored' : 'consumed') ||
      balance.reserved !== 0 ||
      balance.onHand !== (succeeded ? 10 : 10 - reservation!.quantity) ||
      balance.available !== balance.onHand
    ) {
      this.app.throw(409, 'refund event did not durably settle the Commerce order');
    }
    return {
      orderId: order.id,
      orderState: currentOrder.state,
      refundState: currentRequest.state,
      stock: balance.available,
    };
  }

  private _needsDispatch(event: EntityOutboxEvent) {
    try {
      return fixtureEventNeedsDispatch(event);
    } catch {
      this.app.throw(409, 'matching mock webhook outbox is not eligible for dispatch');
    }
  }

  private _matchPaymentEvent(
    events: EntityOutboxEvent[],
    inboxes: Parameters<typeof selectPaymentFixtureEvent>[1],
    expected: Parameters<typeof selectPaymentFixtureEvent>[2],
  ) {
    try {
      return selectPaymentFixtureEvent(events, inboxes, expected);
    } catch {
      this.app.throw(409, 'matching processed mock payment webhook outbox is required');
    }
  }

  private _matchRefundEvent(
    events: EntityOutboxEvent[],
    inboxes: Parameters<typeof selectRefundFixtureEvent>[1],
    expected: Parameters<typeof selectRefundFixtureEvent>[2],
  ) {
    try {
      return selectRefundFixtureEvent(events, inboxes, expected);
    } catch {
      this.app.throw(409, 'matching processed mock refund webhook outbox is required');
    }
  }

  @Core.transaction()
  async removeOrder(orderId: TableIdentity) {
    const order = await this._order(orderId);
    const pay = this.$scope.pay;
    const payment = this.$scope.commercePayment;
    const attempts = await payment.model.paymentAttempt.select({ where: { orderId: order.id } });
    const refunds = await payment.model.refundRequest.select({ where: { orderId: order.id } });
    const refundAttempts = await payment.model.refundAttempt.select({
      where: { orderId: order.id },
    });
    if (
      attempts.length > 1 ||
      refunds.length > 1 ||
      refundAttempts.length > 1 ||
      (attempts.length === 0 &&
        (refunds.length > 0 || refundAttempts.length > 0 || order.state !== 'awaiting_payment')) ||
      attempts.some(
        item => String(item.userId) !== String(order.userId) || !item.paymentSessionId,
      ) ||
      refunds.some(item => String(item.userId) !== String(order.userId)) ||
      refundAttempts.some(
        item =>
          !refunds.some(
            refund =>
              String(refund.id) === String(item.refundRequestId) &&
              String(refund.userId) === String(order.userId),
          ),
      )
    ) {
      this.app.throw(409, 'E2E order payment/refund ownership conflict');
    }
    for (const attempt of attempts) {
      const session = await this._session(attempt.paymentSessionId!, order.userId);
      if (session.businessReference !== String(attempt.id))
        this.app.throw(409, 'payment ownership conflict');
      const operations = await pay.model.refundOperation.select({
        where: { paymentSessionId: session.id },
      });
      for (const operation of operations) {
        if (
          !refundAttempts.some(
            item =>
              String(item.id) === operation.businessReference &&
              String(item.refundOperationId) === String(operation.id),
          )
        ) {
          this.app.throw(409, 'refund operation ownership conflict');
        }
        await pay.model.outboxEvent.delete({ refundOperationId: operation.id });
        await pay.model.webhookInbox.delete({ refundOperationId: operation.id });
        const providers = await pay.model.providerOperation.select({
          where: { refundOperationId: operation.id },
        });
        for (const provider of providers) {
          await pay.model.providerOperationRecoveryAudit.delete({
            providerOperationId: provider.id,
          });
        }
        await pay.model.providerOperation.delete({ refundOperationId: operation.id });
        await pay.model.refundOperation.deleteById(operation.id);
      }
      await pay.model.outboxEvent.delete({ paymentSessionId: session.id });
      await pay.model.paymentAudit.delete({ paymentSessionId: session.id });
      await pay.model.webhookInbox.delete({ paymentSessionId: session.id });
      const providers = await pay.model.providerOperation.select({
        where: { paymentSessionId: session.id },
      });
      for (const provider of providers)
        await pay.model.providerOperationRecoveryAudit.delete({ providerOperationId: provider.id });
      await pay.model.providerOperation.delete({ paymentSessionId: session.id });
      for (const refund of refunds)
        await payment.model.refundAudit.delete({ refundRequestId: refund.id });
      await payment.model.refundAttempt.delete({ orderId: order.id });
      await payment.model.refundRequest.delete({ orderId: order.id });
      await payment.model.paymentAudit.delete({ paymentAttemptId: attempt.id });
      await payment.model.paymentAttempt.deleteById(attempt.id);
      await pay.model.paymentSession.deleteById(session.id);
    }
    await this.scope.model.shipment.delete({ orderId: order.id });
    await this.scope.model.orderAudit.delete({ orderId: order.id });
    const lines = await this.scope.model.orderLine.select({ where: { orderId: order.id } });
    for (const line of lines) {
      const reservations = await this.scope.model.stockReservation.select({
        where: { orderLineId: line.id },
      });
      const balance = await this.scope.model.stockBalance.get({ skuId: line.skuId });
      if (
        reservations.length !== 1 ||
        !balance ||
        !fixtureReservationMatchesLine(reservations[0], line, balance)
      ) {
        this.app.throw(409, 'E2E order reservation ownership conflict');
      }
      if (reservations[0].state === 'reserved') {
        await this.scope.service.stockBalance.release({
          reservationId: reservations[0].id,
          reason: 'owned E2E fixture cleanup',
        });
      }
      await this.scope.model.stockReservation.deleteById(reservations[0].id);
    }
    await this.scope.model.orderLine.delete({ orderId: order.id });
    await this.scope.model.order.deleteById(order.id);
  }

  @Core.transaction()
  async removeCustomer() {
    const userId = this._ownerId();
    if ((await this.scope.model.order.select({ where: { userId }, limit: 1 })).length)
      this.app.throw(409, 'E2E customer still owns orders');
    const addresses = await this.$scope.commerceMember.model.address.select({ where: { userId } });
    for (const address of addresses)
      await this.$scope.commerceMember.model.address.deleteById(address.id);
    const carts = await this.scope.model.cart.select({ where: { userId } });
    for (const cart of carts) {
      await this.scope.model.cartItem.delete({ cartId: cart.id });
      await this.scope.model.cart.deleteById(cart.id);
    }
  }

  @Core.transaction()
  async removeCatalogue(categoryId: TableIdentity) {
    const userId = await this._operatorId();
    const category = await this.$scope.commerceCatalog.model.category.getById(categoryId);
    if (!category || !isOwnedFixtureName(category.name, userId))
      this.app.throw(404, 'E2E category not found');
    const products = await this.$scope.commerceCatalog.model.product.select({
      where: { categoryId },
    });
    if (products.length !== 1 || products[0].title !== category.name) {
      this.app.throw(409, 'E2E product ownership conflict');
    }
    const skus = await this.$scope.commerceCatalog.model.sku.select({
      where: { productId: products[0].id },
    });
    if (skus.length !== 1 || skus[0].code !== category.name) {
      this.app.throw(409, 'E2E SKU ownership conflict');
    }
    const sku = skus[0];
    if ((await this.scope.model.orderLine.select({ where: { skuId: sku.id }, limit: 1 })).length)
      this.app.throw(409, 'E2E catalogue still has order lines');
    if ((await this.scope.model.cartItem.select({ where: { skuId: sku.id }, limit: 1 })).length) {
      this.app.throw(409, 'E2E catalogue still has cart items');
    }
    const balance = await this.scope.model.stockBalance.get({ skuId: sku.id });
    if (!balance) this.app.throw(409, 'E2E catalogue stock balance is missing');
    if (balance.reserved !== 0 || balance.available !== balance.onHand) {
      this.app.throw(409, 'E2E catalogue still has reserved stock');
    }
    const reservations = await this.scope.model.stockReservation.select({
      where: { stockBalanceId: balance.id },
      limit: 1,
    });
    if (reservations.length) this.app.throw(409, 'E2E catalogue still has stock reservations');
    await this.scope.model.stockAudit.delete({ skuId: sku.id });
    await this.scope.model.stockBalance.deleteById(balance.id);
    await this.$scope.commerceCatalog.model.sku.deleteById(sku.id);
    await this.$scope.commerceCatalog.model.product.deleteById(products[0].id);
    await this.$scope.commerceCatalog.model.category.deleteById(category.id);
  }
}
