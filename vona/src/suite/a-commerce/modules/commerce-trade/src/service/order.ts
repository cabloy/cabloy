import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { EntityPaymentAttempt } from 'vona-module-commerce-payment';
import type {
  EntityRefundAttempt,
  EntityRefundAudit,
  EntityRefundRequest,
} from 'vona-module-commerce-payment';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoCheckoutCreate } from '../dto/checkoutCreate.tsx';
import type { DtoCheckoutResult } from '../dto/checkoutResult.tsx';
import type { DtoOrderAddressSnapshot } from '../dto/orderAddressSnapshot.tsx';
import type { DtoOrderCouponSnapshot } from '../dto/orderCouponSnapshot.tsx';
import type { DtoOrderDetail } from '../dto/orderDetail.tsx';
import type { DtoOrderLineSkuAttributeSnapshot } from '../dto/orderLineSkuAttributeSnapshot.tsx';
import type { DtoOrderMineRes } from '../dto/orderMineRes.tsx';
import type { DtoOrderSelectRes } from '../dto/orderSelectRes.tsx';
import type { DtoOrderShip } from '../dto/orderShip.tsx';
import type { DtoOrderSummary } from '../dto/orderSummary.tsx';
import type { DtoOrderView } from '../dto/orderView.tsx';
import type { DtoPaymentOutcomeCreate } from '../dto/paymentOutcomeCreate.tsx';
import type { DtoPaymentOutcomeResult } from '../dto/paymentOutcomeResult.tsx';
import type { DtoRefundOutcomeCreate } from '../dto/refundOutcomeCreate.tsx';
import type { DtoRefundRequestCreate } from '../dto/refundRequestCreate.tsx';
import type { DtoRefundResult } from '../dto/refundResult.tsx';
import type { DtoRefundReview } from '../dto/refundReview.tsx';
import type { DtoShipmentView } from '../dto/shipmentView.tsx';
import type { EntityOrder } from '../entity/order.tsx';
import type { EntityOrderLine } from '../entity/orderLine.tsx';
import type { EntityShipment } from '../entity/shipment.tsx';
import type { ModelOrder } from '../model/order.ts';

const maxOrderCents = 2_147_483_647;
const customerVisibleOrderStates: EntityOrder['state'][] = [
  'awaiting_payment',
  'paid',
  'refund_requested',
  'refund_approved',
  'refund_rejected',
  'shipped',
  'refunded',
  'cancelled',
  'expired',
];

const serializationRetryOptions = {
  retries: 1,
  factor: 1,
  minTimeout: 0,
  maxTimeout: 0,
  randomize: false,
  errorCodes: ['40001', 'ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'],
};

const checkoutSerializationRetryOptions = {
  ...serializationRetryOptions,
  retries: 3,
};

export interface IOrderSnapshotLineCommand {
  skuId: TableIdentity;
  quantity: number;
}

export interface IOrderSnapshotCreateCommand {
  addressId: TableIdentity;
  correlationId: string;
  couponGrantId?: TableIdentity;
  lines: IOrderSnapshotLineCommand[];
}

export interface IOrderSnapshotCreateResult {
  order: EntityOrder;
  lines: EntityOrderLine[];
}

export type CheckoutFailureStage =
  | 'afterOrderSnapshot'
  | 'afterCouponReservation'
  | 'afterStockReservation'
  | 'afterPaymentAttempt'
  | 'afterOrderAudit'
  | 'afterCartMutation';

type CheckoutStageCallback = (stage: CheckoutFailureStage) => void | Promise<void>;

export type PaymentOutcomeFailureStage =
  | 'afterOrderState'
  | 'afterPaymentAttempt'
  | 'afterResourceTransition'
  | 'afterPaymentAudit'
  | 'afterOrderAudit';

type PaymentOutcomeStageCallback = (stage: PaymentOutcomeFailureStage) => void | Promise<void>;

export type ShipmentFailureStage =
  | 'beforeOrderLock'
  | 'afterShipmentInsert'
  | 'afterOrderState'
  | 'afterOrderAudit';

type ShipmentStageCallback = (stage: ShipmentFailureStage) => void | Promise<void>;

export type RefundFailureStage =
  | 'beforeRefundOutcomeOrderLock'
  | 'afterRefundRequestInsert'
  | 'afterRefundRequestOrderState'
  | 'afterRefundRequestAudit'
  | 'afterRefundRequestOrderAudit'
  | 'afterRefundReviewRequestState'
  | 'afterRefundAttemptInsert'
  | 'afterRefundReviewOrderState'
  | 'afterRefundReviewAudit'
  | 'afterRefundReviewOrderAudit'
  | 'afterRefundAttemptState'
  | 'afterRefundOutcomeRequestState'
  | 'afterRefundOutcomeOrderState'
  | 'afterRefundStockRestore'
  | 'afterRefundOutcomeOrderAudit'
  | 'afterRefundOutcomeAudit';

type RefundStageCallback = (stage: RefundFailureStage) => void | Promise<void>;

interface IPreparedOrderLine {
  index: number;
  skuId: TableIdentity;
  productId: TableIdentity;
  skuCodeSnapshot: string;
  titleSnapshot: string;
  skuAttributesSnapshot: DtoOrderLineSkuAttributeSnapshot[];
  unitPriceCents: number;
  quantity: number;
  eligibleSubtotalCents: number;
}

@Service()
export class ServiceOrder extends BeanBase {
  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async createSnapshot(command: IOrderSnapshotCreateCommand): Promise<IOrderSnapshotCreateResult> {
    this._assertCommand(command);

    const existingOrder = await this.scope.model.order.getForUpdate({
      userId: this.bean.passport.currentUser!.id,
      correlationId: command.correlationId,
    });
    if (existingOrder) {
      await this._assertExistingSnapshotMatchesCommand(existingOrder, command);
      return (await this._viewSnapshot(existingOrder))!;
    }

    const address = await this.$scope.commerceMember.model.address.get({
      id: command.addressId,
      userId: this.bean.passport.currentUser!.id,
    });
    if (!address) {
      this.app.throw(404, 'Address not found');
    }

    const preparedLines = await Promise.all(
      command.lines.map((line, index) => this._prepareLine(line, index)),
    );
    const eligibleSubtotalCents = preparedLines.reduce((total, line) => {
      const nextTotal = total + line.eligibleSubtotalCents;
      if (!Number.isSafeInteger(nextTotal) || nextTotal > maxOrderCents) {
        this.app.throw(400, 'order total exceeds the supported range');
      }
      return nextTotal;
    }, 0);
    const order = await this.scope.model.order.insert({
      userId: this.bean.passport.currentUser!.id,
      addressId: address.id,
      correlationId: command.correlationId,
      addressSnapshot: this._toAddressSnapshot(address),
      state: 'awaiting_payment',
      currency: 'USD',
      eligibleSubtotalCents,
      discountCents: 0,
      payableTotalCents: eligibleSubtotalCents,
      reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    let couponSnapshot: DtoOrderCouponSnapshot | undefined;
    if (command.couponGrantId) {
      const reservation = await this.$scope.commercePromotion.service.coupon.reserve({
        couponGrantId: command.couponGrantId,
        userId: this.bean.passport.currentUser!.id,
        orderId: order.id,
        eligibleSubtotalCents,
        currency: 'USD',
        correlationId: `${command.correlationId}:coupon`,
        reason: 'order snapshot created',
      });
      const couponGrant = reservation.couponGrant;
      couponSnapshot = {
        couponGrantId: couponGrant.id,
        couponTemplateId: couponGrant.templateId,
        couponCode: couponGrant.couponCode,
        templateName: couponGrant.templateNameSnapshot,
        currency: couponGrant.currencySnapshot,
        fixedDiscountCents: couponGrant.discountCentsSnapshot,
        minSpendCents: couponGrant.minSpendCentsSnapshot,
        appliedDiscountCents: reservation.discountCents,
      };
      await this.scope.model.order.updateById(order.id, {
        couponSnapshot,
        discountCents: reservation.discountCents,
        payableTotalCents: eligibleSubtotalCents - reservation.discountCents,
      });
      order.couponSnapshot = couponSnapshot;
      order.discountCents = reservation.discountCents;
      order.payableTotalCents = eligibleSubtotalCents - reservation.discountCents;
    }
    const lines = await Promise.all(
      preparedLines.map(async line => {
        const orderLine = await this.scope.model.orderLine.insert({
          orderId: order.id,
          skuId: line.skuId,
          productId: line.productId,
          skuCodeSnapshot: line.skuCodeSnapshot,
          titleSnapshot: line.titleSnapshot,
          skuAttributesSnapshot: line.skuAttributesSnapshot,
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
          eligibleSubtotalCents: line.eligibleSubtotalCents,
          lineTotalCents: line.eligibleSubtotalCents,
        });
        await this.scope.service.stockBalance.reserve({
          skuId: orderLine.skuId,
          orderLineId: orderLine.id,
          quantity: orderLine.quantity,
          correlationId: `${command.correlationId}:line:${line.index}`,
          reason: 'order snapshot created',
        });
        return orderLine;
      }),
    );
    return { order, lines };
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(checkoutSerializationRetryOptions)
  async checkout(command: DtoCheckoutCreate): Promise<DtoCheckoutResult> {
    return await this._checkout(command);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async checkoutForTest(
    command: DtoCheckoutCreate,
    onStage: CheckoutStageCallback,
  ): Promise<DtoCheckoutResult> {
    return await this._checkout(command, onStage);
  }

  private async _checkout(
    command: DtoCheckoutCreate,
    onStage?: CheckoutStageCallback,
  ): Promise<DtoCheckoutResult> {
    this._assertCheckoutCommand(command);
    const userId = this.bean.passport.currentUser!.id;
    const existingOrder = await this.scope.model.order.getForUpdate({
      userId,
      correlationId: command.correlationId,
    });
    if (existingOrder) {
      if (
        String(existingOrder.addressId) !== String(command.addressId) ||
        String(existingOrder.couponSnapshot?.couponGrantId ?? '') !==
          String(command.couponGrantId ?? '')
      ) {
        this.app.throw(409, 'checkout correlation conflicts with an existing order');
      }
      return await this._checkoutResult(existingOrder);
    }

    const cart = await this.scope.model.cart.getForUpdate({ userId });
    if (!cart) this.app.throw(409, 'cart is empty');
    const cartItems = await this.scope.model.cartItem.select({
      where: { cartId: cart.id },
      orders: [['skuId', 'asc']],
    });
    if (cartItems.length === 0) this.app.throw(409, 'cart is empty');

    const lockedCartItems: typeof cartItems = [];
    for (const item of cartItems) {
      const lockedItem = await this.scope.model.cartItem.getByIdForUpdate(item.id);
      if (lockedItem && String(lockedItem.cartId) === String(cart.id))
        lockedCartItems.push(lockedItem);
    }
    if (lockedCartItems.length === 0) this.app.throw(409, 'cart is empty');

    const preparedLines: IPreparedOrderLine[] = [];
    for (const [index, item] of lockedCartItems.entries()) {
      preparedLines.push(
        await this._prepareLine({ skuId: item.skuId, quantity: item.quantity }, index),
      );
    }
    const address = await this.$scope.commerceMember.model.address.get({
      id: command.addressId,
      userId,
    });
    if (!address) this.app.throw(404, 'Address not found');

    const { order } = await this._createOrder({
      userId,
      address,
      correlationId: command.correlationId,
      couponGrantId: command.couponGrantId,
      preparedLines,
      reason: 'checkout created',
      onStage,
    });
    const paymentAttempt = await this.$scope.commercePayment.service.paymentAttempt.create({
      orderId: order.id,
      userId,
      currency: order.currency,
      amountCents: order.payableTotalCents,
      correlationId: `${command.correlationId}:payment`,
    });
    await onStage?.('afterPaymentAttempt');
    await this._appendAudit({
      orderId: order.id,
      operation: 'created',
      toState: 'awaiting_payment',
      correlationId: command.correlationId,
      reason: 'checkout created',
    });
    await onStage?.('afterOrderAudit');
    for (const item of lockedCartItems) {
      await this.scope.model.cartItem.deleteById(item.id);
    }
    await onStage?.('afterCartMutation');
    return {
      orderId: order.id,
      paymentAttemptId: paymentAttempt.id,
      paymentSessionId: paymentAttempt.paymentSessionId!,
      state: 'awaiting_payment',
      paymentAttemptState: 'created',
      currency: order.currency,
      payableTotalCents: order.payableTotalCents,
      reservationExpiresAt: order.reservationExpiresAt,
    };
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async applyPaymentOutcome(
    paymentAttemptId: TableIdentity,
    command: DtoPaymentOutcomeCreate,
  ): Promise<DtoPaymentOutcomeResult> {
    return await this._applyPaymentOutcome(paymentAttemptId, command);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async applyPaymentOutcomeForTest(
    paymentAttemptId: TableIdentity,
    command: DtoPaymentOutcomeCreate,
    onStage: PaymentOutcomeStageCallback,
  ): Promise<DtoPaymentOutcomeResult> {
    return await this._applyPaymentOutcome(paymentAttemptId, command, onStage);
  }

  private async _applyPaymentOutcome(
    paymentAttemptId: TableIdentity,
    command: DtoPaymentOutcomeCreate,
    onStage?: PaymentOutcomeStageCallback,
  ): Promise<DtoPaymentOutcomeResult> {
    if (!command.idempotencyKey.trim()) this.app.throw(400, 'payment idempotencyKey is required');
    const userId = this.bean.passport.currentUser!.id;
    const attempt =
      await this.$scope.commercePayment.model.paymentAttempt.getById(paymentAttemptId);
    if (!attempt || String(attempt.userId) !== String(userId)) {
      this.app.throw(404, 'payment attempt not found');
    }
    const order = await this.scope.model.order.getByIdForUpdate(attempt.orderId);
    if (!order || String(order.userId) !== String(userId)) this.app.throw(404, 'order not found');
    const lockedAttempt = await this.$scope.commercePayment.model.paymentAttempt.getByIdForUpdate(
      attempt.id,
    );
    if (!lockedAttempt) this.app.throw(404, 'payment attempt not found');

    const existingAudit = await this.$scope.commercePayment.model.paymentAudit.get({
      paymentAttemptId: lockedAttempt.id,
      idempotencyKey: command.idempotencyKey,
    });
    if (existingAudit) {
      if (existingAudit.outcome !== command.outcome) {
        this.app.throw(409, 'payment idempotency key conflicts with an existing outcome');
      }
      return this._paymentOutcomeResult(order, lockedAttempt);
    }
    if (order.state !== 'awaiting_payment' || lockedAttempt.state !== 'created') {
      this.app.throw(409, 'payment attempt is no longer available');
    }
    if (order.reservationExpiresAt <= new Date()) {
      await this._expireLockedOrder(order);
      const expiredAttempt = await this.$scope.commercePayment.model.paymentAttempt.getById(
        lockedAttempt.id,
      );
      return this._paymentOutcomeResult({ ...order, state: 'expired' }, expiredAttempt!);
    }

    const correlationId = `${order.correlationId}:payment:${command.idempotencyKey}`;
    const normalizedOutcome =
      this.$scope.commercePayment.service.mockPaymentAdapter.normalizeOutcome(command.outcome);
    const orderState = normalizedOutcome === 'succeeded' ? 'paid' : 'cancelled';
    const reason =
      normalizedOutcome === 'succeeded'
        ? 'mock payment succeeded'
        : normalizedOutcome === 'failed'
          ? 'mock payment failed'
          : 'mock payment cancelled';

    // Publish the aggregate terminal states before taking line/coupon locks. Concurrent
    // expiry or payment outcomes serialize on this order lock and then observe the winner.
    await this.scope.model.order.updateById(order.id, { state: orderState });
    await onStage?.('afterOrderState');
    const finalizedAttempt = await this.$scope.commercePayment.service.paymentAttempt.finalize(
      order.id,
      normalizedOutcome,
    );
    if (!finalizedAttempt) this.app.throw(404, 'payment attempt not found');
    await onStage?.('afterPaymentAttempt');
    if (normalizedOutcome === 'succeeded') {
      await this._consumeReservedOrderResources(order, correlationId, reason);
    } else {
      await this._releaseReservedOrderResources(order, correlationId, reason);
    }
    await onStage?.('afterResourceTransition');
    await this.$scope.commercePayment.model.paymentAudit.insert({
      paymentAttemptId: finalizedAttempt.id,
      orderId: order.id,
      userId,
      provider: 'mock',
      outcome: normalizedOutcome,
      fromAttemptState: 'created',
      toOrderState: orderState,
      idempotencyKey: command.idempotencyKey,
      correlationId,
      reason,
      actorId: userId,
      processedAt: new Date(),
    });
    await onStage?.('afterPaymentAudit');
    await this._appendAudit({
      orderId: order.id,
      operation: orderState === 'paid' ? 'paid' : 'cancelled',
      fromState: 'awaiting_payment',
      toState: orderState,
      correlationId,
      reason,
    });
    await onStage?.('afterOrderAudit');
    return this._paymentOutcomeResult({ ...order, state: orderState }, finalizedAttempt);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async requestRefund(
    orderId: TableIdentity,
    command: DtoRefundRequestCreate,
  ): Promise<DtoRefundResult> {
    return await this._requestRefund(orderId, command);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async requestRefundForTest(
    orderId: TableIdentity,
    command: DtoRefundRequestCreate,
    onStage: RefundStageCallback,
  ): Promise<DtoRefundResult> {
    return await this._requestRefund(orderId, command, onStage);
  }

  private async _requestRefund(
    orderId: TableIdentity,
    command: DtoRefundRequestCreate,
    onStage?: RefundStageCallback,
  ): Promise<DtoRefundResult> {
    const reason = command.reason.trim();
    const idempotencyKey = command.idempotencyKey.trim();
    if (!reason) this.app.throw(400, 'refund reason is required');
    if (!idempotencyKey) this.app.throw(400, 'refund idempotencyKey is required');
    const userId = this.bean.passport.currentUser!.id;
    const order = await this.scope.model.order.getByIdForUpdate(orderId);
    if (!order || String(order.userId) !== String(userId)) this.app.throw(404, 'order not found');

    const existingAudit = await this.$scope.commercePayment.model.refundAudit.get({
      orderId: order.id,
      idempotencyKey,
    });
    if (existingAudit) return await this._requestReplayResult(order, existingAudit, reason);

    const activeRequest = await this.$scope.commercePayment.model.refundRequest.getForUpdate({
      orderId: order.id,
      state: ['requested', 'approved'],
    });
    if (activeRequest) this.app.throw(409, 'order already has an active refund request');
    if (order.state !== 'paid') this.app.throw(409, 'order is not available for refund');

    const correlationId = `${order.correlationId}:refund:${idempotencyKey}`;
    const refundRequest = await this.$scope.commercePayment.model.refundRequest.insert({
      orderId: order.id,
      userId,
      state: 'requested',
      currency: order.currency,
      amountCents: order.payableTotalCents,
      correlationId,
      reason,
    });
    await onStage?.('afterRefundRequestInsert');
    await this.scope.model.order.updateById(order.id, { state: 'refund_requested' });
    await onStage?.('afterRefundRequestOrderState');
    await this._appendRefundAudit({
      refundRequest,
      order,
      toRefundState: 'requested',
      idempotencyKey,
      correlationId,
      reason,
    });
    await onStage?.('afterRefundRequestAudit');
    await this._appendAudit({
      orderId: order.id,
      operation: 'refund_requested',
      fromState: 'paid',
      toState: 'refund_requested',
      correlationId,
      reason,
    });
    await onStage?.('afterRefundRequestOrderAudit');
    return this._refundResult({ ...order, state: 'refund_requested' }, refundRequest);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async approveRefund(orderId: TableIdentity, command: DtoRefundReview): Promise<DtoRefundResult> {
    return await this._reviewRefund(orderId, command, 'approved');
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async rejectRefund(orderId: TableIdentity, command: DtoRefundReview): Promise<DtoRefundResult> {
    return await this._reviewRefund(orderId, command, 'rejected');
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async reviewRefundForTest(
    orderId: TableIdentity,
    command: DtoRefundReview,
    decision: 'approved' | 'rejected',
    onStage: RefundStageCallback,
  ): Promise<DtoRefundResult> {
    return await this._reviewRefund(orderId, command, decision, onStage);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async applyRefundOutcome(
    orderId: TableIdentity,
    command: DtoRefundOutcomeCreate,
  ): Promise<DtoRefundResult> {
    return await this._applyRefundOutcome(orderId, command);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async applyRefundOutcomeForTest(
    orderId: TableIdentity,
    command: DtoRefundOutcomeCreate,
    onStage: RefundStageCallback,
  ): Promise<DtoRefundResult> {
    return await this._applyRefundOutcome(orderId, command, onStage);
  }

  private async _applyRefundOutcome(
    orderId: TableIdentity,
    command: DtoRefundOutcomeCreate,
    onStage?: RefundStageCallback,
  ): Promise<DtoRefundResult> {
    const idempotencyKey = command.idempotencyKey.trim();
    if (!idempotencyKey) this.app.throw(400, 'refund idempotencyKey is required');
    await onStage?.('beforeRefundOutcomeOrderLock');
    const order = await this.scope.model.order.getByIdForUpdate(orderId);
    if (!order) this.app.throw(404, 'order not found');
    const existingAudit = await this.$scope.commercePayment.model.refundAudit.get({
      orderId: order.id,
      idempotencyKey,
    });
    if (existingAudit)
      return await this._outcomeReplayResult(order, existingAudit, command.outcome);

    const refundRequest = await this.$scope.commercePayment.model.refundRequest.getForUpdate({
      orderId: order.id,
      state: 'approved',
    });
    if (!refundRequest) this.app.throw(404, 'approved refund request not found');
    const refundAttempt = await this.$scope.commercePayment.model.refundAttempt.getForUpdate({
      refundRequestId: refundRequest.id,
    });
    if (!refundAttempt) this.app.throw(404, 'refund attempt not found');
    if (order.state !== 'refund_approved' || refundAttempt.state !== 'created') {
      this.app.throw(409, 'refund is not available for execution');
    }

    const correlationId = `${order.correlationId}:refund:${idempotencyKey}`;
    const now = new Date();
    const isSucceeded = command.outcome === 'succeeded';
    const refundState = isSucceeded ? 'refunded' : 'failed';
    const orderState = isSucceeded ? 'refunded' : 'paid';
    const reason = isSucceeded ? 'mock refund succeeded' : 'mock refund failed';
    await this.$scope.commercePayment.model.refundAttempt.updateById(refundAttempt.id, {
      state: command.outcome,
      finalizedAt: now,
    });
    await onStage?.('afterRefundAttemptState');
    await this.$scope.commercePayment.model.refundRequest.updateById(refundRequest.id, {
      state: refundState,
      finalizedAt: now,
    });
    await onStage?.('afterRefundOutcomeRequestState');
    await this.scope.model.order.updateById(order.id, { state: orderState });
    await onStage?.('afterRefundOutcomeOrderState');
    if (isSucceeded) {
      await this._restoreConsumedOrderStock(order, reason);
      await onStage?.('afterRefundStockRestore');
    }
    await this._appendAudit({
      orderId: order.id,
      operation: isSucceeded ? 'refunded' : 'refund_failed',
      fromState: 'refund_approved',
      toState: orderState,
      correlationId,
      reason,
    });
    await onStage?.('afterRefundOutcomeOrderAudit');
    await this._appendRefundAudit({
      refundRequest,
      refundAttempt,
      order,
      toRefundState: refundState,
      attemptState: command.outcome,
      idempotencyKey,
      correlationId,
      reason,
    });
    await onStage?.('afterRefundOutcomeAudit');
    return this._refundResult(
      { ...order, state: orderState },
      { ...refundRequest, state: refundState },
      { ...refundAttempt, state: command.outcome },
    );
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async ship(orderId: TableIdentity, command: DtoOrderShip): Promise<DtoShipmentView> {
    return await this._ship(orderId, command);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async shipForTest(
    orderId: TableIdentity,
    command: DtoOrderShip,
    onStage: ShipmentStageCallback,
  ): Promise<DtoShipmentView> {
    return await this._ship(orderId, command, onStage);
  }

  private async _ship(
    orderId: TableIdentity,
    command: DtoOrderShip,
    onStage?: ShipmentStageCallback,
  ): Promise<DtoShipmentView> {
    const carrier = command.carrier.trim();
    const trackingNumber = command.trackingNumber.trim();
    if (!carrier) this.app.throw(400, 'shipment carrier is required');
    if (!trackingNumber) this.app.throw(400, 'shipment trackingNumber is required');

    await onStage?.('beforeOrderLock');
    const order = await this.scope.model.order.getByIdForUpdate(orderId);
    if (!order) this.app.throw(404, 'order not found');
    const existingShipment = await this.scope.model.shipment.get({ orderId: order.id });
    if (order.state === 'shipped' && existingShipment) {
      if (
        existingShipment.carrier !== carrier ||
        existingShipment.trackingNumber !== trackingNumber
      ) {
        this.app.throw(409, 'shipment conflicts with the existing shipment');
      }
      return this._shipmentView(existingShipment);
    }
    if (order.state !== 'paid') this.app.throw(409, 'order is not available for shipment');
    if (existingShipment) this.app.throw(409, 'order already has a shipment');

    const correlationId = `${order.correlationId}:shipment`;
    const shipment = await this.scope.model.shipment.insert({
      orderId: order.id,
      carrier,
      trackingNumber,
      operatorId: this.bean.passport.currentUser!.id,
      shippedAt: new Date(),
      correlationId,
    });
    await onStage?.('afterShipmentInsert');
    await this.scope.model.order.updateById(order.id, { state: 'shipped' });
    await onStage?.('afterOrderState');
    await this._appendAudit({
      orderId: order.id,
      operation: 'shipped',
      fromState: 'paid',
      toState: 'shipped',
      correlationId,
      reason: 'order shipped',
    });
    await onStage?.('afterOrderAudit');
    const persistedShipment = await this.scope.model.shipment.getByIdForUpdate(shipment.id);
    if (!persistedShipment) this.app.throw(500, 'persisted shipment not found');
    return this._shipmentView(persistedShipment);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async expireIfDue(orderId: TableIdentity, now = new Date()): Promise<boolean> {
    const order = await this.scope.model.order.getByIdForUpdate(orderId);
    if (!order || order.state !== 'awaiting_payment' || order.reservationExpiresAt > now)
      return false;

    await this._expireLockedOrder(order);
    return true;
  }

  async select(params?: IQueryParams<ModelOrder>): Promise<DtoOrderSelectRes> {
    return await this.scope.model.order.selectAndCount({
      ...params,
      orders: params?.orders ?? [['id', 'desc']],
    });
  }

  async view(id: TableIdentity): Promise<DtoOrderView | undefined> {
    return await this.scope.model.order.getById(id, { include: { shipment: true } });
  }

  async mine(params?: IQueryParams<ModelOrder>): Promise<DtoOrderMineRes> {
    const result = await this.scope.model.order.selectAndCount({
      ...params,
      columns: ['id', 'state', 'currency', 'payableTotalCents', 'createdAt'],
      where: {
        ...params?.where,
        userId: this.bean.passport.currentUser!.id,
        state: customerVisibleOrderStates,
      },
      orders: params?.orders ?? [['id', 'desc']],
    });
    return {
      ...result,
      list: result.list.map(order => ({
        ...order,
        state: order.state as DtoOrderSummary['state'],
      })),
    };
  }

  async viewMine(id: TableIdentity): Promise<DtoOrderDetail | undefined> {
    const snapshot = await this._viewMineSnapshot(id);
    if (!snapshot) return undefined;
    const { order, lines } = snapshot;
    if (!customerVisibleOrderStates.includes(order.state)) {
      this.app.throw(409, 'order state is not available to customers');
    }
    const shipment = await this.scope.model.shipment.get({ orderId: order.id });
    return {
      id: order.id,
      state: order.state,
      currency: order.currency,
      eligibleSubtotalCents: order.eligibleSubtotalCents,
      discountCents: order.discountCents,
      payableTotalCents: order.payableTotalCents,
      reservationExpiresAt: order.reservationExpiresAt,
      addressSnapshot: order.addressSnapshot,
      couponSnapshot: order.couponSnapshot,
      shipment: shipment ? this._shipmentView(shipment) : undefined,
      lines: lines.map(line => ({
        id: line.id,
        skuCodeSnapshot: line.skuCodeSnapshot,
        titleSnapshot: line.titleSnapshot,
        skuAttributesSnapshot: line.skuAttributesSnapshot,
        unitPriceCents: line.unitPriceCents,
        quantity: line.quantity,
        lineTotalCents: line.lineTotalCents,
      })),
    };
  }

  async viewSnapshot(id: TableIdentity): Promise<IOrderSnapshotCreateResult | undefined> {
    const order = await this.scope.model.order.getById(id);
    if (!order) return undefined;
    return await this._viewSnapshot(order);
  }

  private async _viewMineSnapshot(
    id: TableIdentity,
  ): Promise<IOrderSnapshotCreateResult | undefined> {
    const order = await this.scope.model.order.get({
      id,
      userId: this.bean.passport.currentUser!.id,
    });
    if (!order) return undefined;
    return await this._viewSnapshot(order);
  }

  private async _reviewRefund(
    orderId: TableIdentity,
    command: DtoRefundReview,
    decision: 'approved' | 'rejected',
    onStage?: RefundStageCallback,
  ): Promise<DtoRefundResult> {
    const reason = command.reason.trim();
    const idempotencyKey = command.idempotencyKey.trim();
    if (!reason) this.app.throw(400, 'refund review reason is required');
    if (!idempotencyKey) this.app.throw(400, 'refund idempotencyKey is required');
    const order = await this.scope.model.order.getByIdForUpdate(orderId);
    if (!order) this.app.throw(404, 'order not found');

    const existingAudit = await this.$scope.commercePayment.model.refundAudit.get({
      orderId: order.id,
      idempotencyKey,
    });
    if (existingAudit)
      return await this._reviewReplayResult(order, existingAudit, decision, reason);

    const refundRequest = await this.$scope.commercePayment.model.refundRequest.getForUpdate({
      orderId: order.id,
      state: 'requested',
    });
    if (!refundRequest) this.app.throw(404, 'refund request is not available for review');
    if (order.state !== 'refund_requested')
      this.app.throw(409, 'refund is not available for review');
    if (await this.scope.model.shipment.get({ orderId: order.id })) {
      this.app.throw(409, 'shipped order is not available for refund');
    }

    const actorId = this.bean.passport.currentUser!.id;
    const now = new Date();
    const correlationId = `${order.correlationId}:refund:${decision}:${idempotencyKey}`;
    const orderState = decision === 'approved' ? 'refund_approved' : 'paid';
    await this.$scope.commercePayment.model.refundRequest.updateById(refundRequest.id, {
      state: decision,
      reviewedBy: actorId,
      reviewedAt: now,
    });
    await onStage?.('afterRefundReviewRequestState');
    let refundAttempt:
      | Awaited<ReturnType<typeof this.$scope.commercePayment.model.refundAttempt.insert>>
      | undefined;
    if (decision === 'approved') {
      refundAttempt = await this.$scope.commercePayment.model.refundAttempt.insert({
        refundRequestId: refundRequest.id,
        orderId: order.id,
        userId: refundRequest.userId,
        state: 'created',
        currency: refundRequest.currency,
        amountCents: refundRequest.amountCents,
        correlationId,
      });
      await onStage?.('afterRefundAttemptInsert');
    }
    await this.scope.model.order.updateById(order.id, { state: orderState });
    await onStage?.('afterRefundReviewOrderState');
    await this._appendRefundAudit({
      refundRequest,
      refundAttempt,
      order,
      toRefundState: decision,
      attemptState: refundAttempt?.state,
      idempotencyKey,
      correlationId,
      reason,
    });
    await onStage?.('afterRefundReviewAudit');
    await this._appendAudit({
      orderId: order.id,
      operation: decision === 'approved' ? 'refund_approved' : 'refund_rejected',
      fromState: 'refund_requested',
      toState: orderState,
      correlationId,
      reason,
    });
    await onStage?.('afterRefundReviewOrderAudit');
    return this._refundResult(
      { ...order, state: orderState },
      { ...refundRequest, state: decision },
      refundAttempt,
    );
  }

  private async _requestReplayResult(
    order: EntityOrder,
    audit: EntityRefundAudit,
    reason: string,
  ): Promise<DtoRefundResult> {
    if (audit.toRefundState !== 'requested' || audit.reason !== reason) {
      this.app.throw(409, 'refund idempotency key conflicts with an existing request');
    }
    const refundRequest = await this.$scope.commercePayment.model.refundRequest.getById(
      audit.refundRequestId,
    );
    if (!refundRequest) this.app.throw(404, 'refund request not found');
    const refundAttempt = await this.$scope.commercePayment.model.refundAttempt.get({
      refundRequestId: refundRequest.id,
    });
    return this._refundResult(order, refundRequest, refundAttempt);
  }

  private async _reviewReplayResult(
    order: EntityOrder,
    audit: EntityRefundAudit,
    decision: 'approved' | 'rejected',
    reason: string,
  ): Promise<DtoRefundResult> {
    if (audit.toRefundState !== decision || audit.reason !== reason) {
      this.app.throw(409, 'refund idempotency key conflicts with an existing review');
    }
    const refundRequest = await this.$scope.commercePayment.model.refundRequest.getById(
      audit.refundRequestId,
    );
    if (!refundRequest) this.app.throw(404, 'refund request not found');
    const refundAttempt = audit.refundAttemptId
      ? await this.$scope.commercePayment.model.refundAttempt.getById(audit.refundAttemptId)
      : undefined;
    return this._refundResult(order, refundRequest, refundAttempt);
  }

  private async _outcomeReplayResult(
    order: EntityOrder,
    audit: EntityRefundAudit,
    outcome: 'succeeded' | 'failed',
  ): Promise<DtoRefundResult> {
    if (audit.attemptState !== outcome) {
      this.app.throw(409, 'refund idempotency key conflicts with an existing outcome');
    }
    const refundRequest = await this.$scope.commercePayment.model.refundRequest.getById(
      audit.refundRequestId,
    );
    const refundAttempt = audit.refundAttemptId
      ? await this.$scope.commercePayment.model.refundAttempt.getById(audit.refundAttemptId)
      : undefined;
    if (!refundRequest || !refundAttempt) this.app.throw(404, 'refund attempt not found');
    return this._refundResult(order, refundRequest, refundAttempt);
  }

  private async _restoreConsumedOrderStock(order: EntityOrder, reason: string) {
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['skuId', 'asc']],
    });
    for (const line of lines) {
      const reservation = await this.scope.model.stockReservation.get({ orderLineId: line.id });
      if (reservation)
        await this.scope.service.stockBalance.restore({ reservationId: reservation.id, reason });
    }
  }

  private _refundResult(
    order: Pick<EntityOrder, 'id' | 'state' | 'currency'>,
    refundRequest: Pick<EntityRefundRequest, 'id' | 'state' | 'amountCents'>,
    refundAttempt?: Pick<EntityRefundAttempt, 'id' | 'state'>,
  ): DtoRefundResult {
    if (
      order.state !== 'paid' &&
      order.state !== 'refund_requested' &&
      order.state !== 'refund_approved' &&
      order.state !== 'refund_rejected' &&
      order.state !== 'refunded'
    ) {
      this.app.throw(409, 'refund result is not available');
    }
    return {
      orderId: order.id,
      refundRequestId: refundRequest.id,
      refundAttemptId: refundAttempt?.id,
      orderState: order.state,
      refundState: refundRequest.state,
      refundAttemptState: refundAttempt?.state,
      currency: order.currency,
      amountCents: refundRequest.amountCents,
    };
  }

  private async _appendRefundAudit({
    refundRequest,
    refundAttempt,
    order,
    toRefundState,
    attemptState,
    idempotencyKey,
    correlationId,
    reason,
  }: {
    refundRequest: Pick<EntityRefundRequest, 'id' | 'userId'>;
    refundAttempt?: Pick<EntityRefundAttempt, 'id'>;
    order: Pick<EntityOrder, 'id'>;
    toRefundState: 'requested' | 'approved' | 'rejected' | 'refunded' | 'failed';
    attemptState?: 'created' | 'succeeded' | 'failed';
    idempotencyKey?: string;
    correlationId: string;
    reason: string;
  }) {
    await this.$scope.commercePayment.model.refundAudit.insert({
      refundRequestId: refundRequest.id,
      refundAttemptId: refundAttempt?.id,
      orderId: order.id,
      userId: refundRequest.userId,
      toRefundState,
      attemptState,
      idempotencyKey,
      correlationId,
      reason,
      actorId: this.bean.passport.currentUser?.anonymous
        ? undefined
        : this.bean.passport.currentUser?.id,
      processedAt: new Date(),
    });
  }

  private async _expireLockedOrder(order: EntityOrder) {
    const correlationId = `${order.correlationId}:expiry`;
    const reason = 'unpaid order expired';
    await this._releaseReservedOrderResources(order, correlationId, reason);
    await this.$scope.commercePayment.service.paymentAttempt.cancel(order.id);
    await this.scope.model.order.updateById(order.id, { state: 'expired' });
    await this._appendAudit({
      orderId: order.id,
      operation: 'expired',
      fromState: 'awaiting_payment',
      toState: 'expired',
      correlationId,
      reason,
    });
  }

  private async _consumeReservedOrderResources(
    order: EntityOrder,
    correlationId: string,
    reason: string,
  ) {
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['skuId', 'asc']],
    });
    for (const line of lines) {
      const reservation = await this.scope.model.stockReservation.get({ orderLineId: line.id });
      if (reservation) {
        await this.scope.service.stockBalance.consume({ reservationId: reservation.id, reason });
      }
    }
    if (order.couponSnapshot) {
      await this.$scope.commercePromotion.service.coupon.redeem({
        couponGrantId: order.couponSnapshot.couponGrantId,
        orderId: order.id,
        correlationId: `${correlationId}:coupon`,
        reason,
      });
    }
  }

  private async _releaseReservedOrderResources(
    order: EntityOrder,
    correlationId: string,
    reason: string,
  ) {
    if (order.couponSnapshot) {
      await this.$scope.commercePromotion.service.coupon.release({
        couponGrantId: order.couponSnapshot.couponGrantId,
        orderId: order.id,
        correlationId: `${correlationId}:coupon`,
        reason,
      });
    }
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['skuId', 'asc']],
    });
    for (const line of lines) {
      const reservation = await this.scope.model.stockReservation.get({ orderLineId: line.id });
      if (reservation) {
        await this.scope.service.stockBalance.release({ reservationId: reservation.id, reason });
      }
    }
  }

  private _paymentOutcomeResult(
    order: Pick<EntityOrder, 'id' | 'state' | 'currency' | 'payableTotalCents'>,
    paymentAttempt: Pick<EntityPaymentAttempt, 'id' | 'state'>,
  ): DtoPaymentOutcomeResult {
    if (
      (order.state !== 'paid' && order.state !== 'cancelled' && order.state !== 'expired') ||
      (paymentAttempt.state !== 'succeeded' &&
        paymentAttempt.state !== 'failed' &&
        paymentAttempt.state !== 'cancelled')
    ) {
      this.app.throw(409, 'payment attempt is not finalized');
    }
    return {
      orderId: order.id,
      paymentAttemptId: paymentAttempt.id,
      orderState: order.state,
      paymentAttemptState: paymentAttempt.state,
      currency: order.currency,
      payableTotalCents: order.payableTotalCents,
    };
  }

  private async _checkoutResult(order: EntityOrder): Promise<DtoCheckoutResult> {
    const paymentAttempt = await this.$scope.commercePayment.model.paymentAttempt.get({
      orderId: order.id,
    });
    if (!paymentAttempt) this.app.throw(404, 'checkout payment attempt not found');
    if (
      order.state !== 'awaiting_payment' &&
      order.state !== 'paid' &&
      order.state !== 'cancelled' &&
      order.state !== 'expired'
    ) {
      this.app.throw(409, 'checkout order state is not available');
    }
    return {
      orderId: order.id,
      paymentAttemptId: paymentAttempt.id,
      paymentSessionId: paymentAttempt.paymentSessionId!,
      state: order.state,
      paymentAttemptState: paymentAttempt.state,
      currency: order.currency,
      payableTotalCents: order.payableTotalCents,
      reservationExpiresAt: order.reservationExpiresAt,
    };
  }

  private async _createOrder({
    userId,
    address,
    correlationId,
    couponGrantId,
    preparedLines,
    reason,
    onStage,
  }: {
    userId: TableIdentity;
    address: {
      id: TableIdentity;
      recipientName: string;
      phone: string;
      countryCode: string;
      region: string;
      city: string;
      postalCode: string;
      addressLine1: string;
      addressLine2?: string;
    };
    correlationId: string;
    couponGrantId?: TableIdentity;
    preparedLines: IPreparedOrderLine[];
    reason: string;
    onStage?: CheckoutStageCallback;
  }): Promise<IOrderSnapshotCreateResult> {
    const eligibleSubtotalCents = preparedLines.reduce((total, line) => {
      const nextTotal = total + line.eligibleSubtotalCents;
      if (!Number.isSafeInteger(nextTotal) || nextTotal > maxOrderCents) {
        this.app.throw(400, 'order total exceeds the supported range');
      }
      return nextTotal;
    }, 0);
    const order = await this.scope.model.order.insert({
      userId,
      addressId: address.id,
      correlationId,
      addressSnapshot: this._toAddressSnapshot(address),
      state: 'awaiting_payment',
      currency: 'USD',
      eligibleSubtotalCents,
      discountCents: 0,
      payableTotalCents: eligibleSubtotalCents,
      reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    await onStage?.('afterOrderSnapshot');
    if (couponGrantId) {
      const reservation = await this.$scope.commercePromotion.service.coupon.reserve({
        couponGrantId,
        userId,
        orderId: order.id,
        eligibleSubtotalCents,
        currency: 'USD',
        correlationId: `${correlationId}:coupon`,
        reason,
      });
      const couponGrant = reservation.couponGrant;
      const couponSnapshot: DtoOrderCouponSnapshot = {
        couponGrantId: couponGrant.id,
        couponTemplateId: couponGrant.templateId,
        couponCode: couponGrant.couponCode,
        templateName: couponGrant.templateNameSnapshot,
        currency: couponGrant.currencySnapshot,
        fixedDiscountCents: couponGrant.discountCentsSnapshot,
        minSpendCents: couponGrant.minSpendCentsSnapshot,
        appliedDiscountCents: reservation.discountCents,
      };
      await this.scope.model.order.updateById(order.id, {
        couponSnapshot,
        discountCents: reservation.discountCents,
        payableTotalCents: eligibleSubtotalCents - reservation.discountCents,
      });
      order.couponSnapshot = couponSnapshot;
      order.discountCents = reservation.discountCents;
      order.payableTotalCents = eligibleSubtotalCents - reservation.discountCents;
      await onStage?.('afterCouponReservation');
    }
    const lines: EntityOrderLine[] = [];
    for (const line of preparedLines) {
      const orderLine = await this.scope.model.orderLine.insert({
        orderId: order.id,
        skuId: line.skuId,
        productId: line.productId,
        skuCodeSnapshot: line.skuCodeSnapshot,
        titleSnapshot: line.titleSnapshot,
        skuAttributesSnapshot: line.skuAttributesSnapshot,
        unitPriceCents: line.unitPriceCents,
        quantity: line.quantity,
        eligibleSubtotalCents: line.eligibleSubtotalCents,
        lineTotalCents: line.eligibleSubtotalCents,
      });
      await this.scope.service.stockBalance.reserve({
        skuId: orderLine.skuId,
        orderLineId: orderLine.id,
        quantity: orderLine.quantity,
        correlationId: `${correlationId}:line:${line.index}`,
        reason,
      });
      await onStage?.('afterStockReservation');
      lines.push(orderLine);
    }
    return { order, lines };
  }

  private async _appendAudit({
    orderId,
    operation,
    fromState,
    toState,
    correlationId,
    reason,
  }: {
    orderId: TableIdentity;
    operation:
      | 'created'
      | 'paid'
      | 'cancelled'
      | 'expired'
      | 'shipped'
      | 'refund_requested'
      | 'refund_approved'
      | 'refund_rejected'
      | 'refund_failed'
      | 'refunded';
    fromState?: EntityOrder['state'];
    toState: EntityOrder['state'];
    correlationId: string;
    reason: string;
  }) {
    await this.scope.model.orderAudit.insert({
      orderId,
      operation,
      fromState,
      toState,
      actorId: this.bean.passport.currentUser?.anonymous
        ? undefined
        : this.bean.passport.currentUser?.id,
      correlationId,
      reason,
    });
  }

  private _shipmentView(shipment: EntityShipment): DtoShipmentView {
    return {
      id: shipment.id,
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber,
      shippedAt: shipment.shippedAt,
    };
  }

  private async _viewSnapshot(order: EntityOrder): Promise<IOrderSnapshotCreateResult> {
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['id', 'asc']],
    });
    return { order, lines };
  }

  private async _assertExistingSnapshotMatchesCommand(
    order: EntityOrder,
    command: IOrderSnapshotCreateCommand,
  ) {
    const lines = await this.scope.model.orderLine.select({
      where: { orderId: order.id },
      orders: [['id', 'asc']],
    });
    if (
      String(order.addressId) !== String(command.addressId) ||
      String(order.couponSnapshot?.couponGrantId ?? '') !== String(command.couponGrantId ?? '') ||
      lines.length !== command.lines.length ||
      lines.some(
        (line, index) =>
          String(line.skuId) !== String(command.lines[index].skuId) ||
          line.quantity !== command.lines[index].quantity,
      )
    ) {
      this.app.throw(409, 'order snapshot correlation conflicts with an existing order');
    }
  }

  private async _prepareLine(command: IOrderSnapshotLineCommand, index = 0) {
    if (!Number.isInteger(command.quantity) || command.quantity <= 0) {
      this.app.throw(400, 'order line quantity must be a positive integer');
    }
    const sku = await this.$scope.commerceCatalog.model.sku.getById(command.skuId, {
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!sku || sku.lifecycle !== 'active') {
      this.app.throw(404, 'SKU not found');
    }
    if (!sku.product?.published || !sku.product.category?.published) {
      this.app.throw(409, 'SKU is not sellable');
    }
    const eligibleSubtotalCents = sku.priceCents * command.quantity;
    if (!Number.isSafeInteger(eligibleSubtotalCents) || eligibleSubtotalCents > maxOrderCents) {
      this.app.throw(400, 'order line total exceeds the supported range');
    }
    return {
      index,
      skuId: sku.id,
      productId: sku.product.id,
      skuCodeSnapshot: sku.code,
      titleSnapshot: sku.product.title,
      skuAttributesSnapshot: (sku.attributes ?? []).map(
        attribute =>
          ({
            name: attribute.name,
            value: attribute.value,
          }) satisfies DtoOrderLineSkuAttributeSnapshot,
      ),
      unitPriceCents: sku.priceCents,
      quantity: command.quantity,
      eligibleSubtotalCents,
    };
  }

  private _toAddressSnapshot(address: {
    recipientName: string;
    phone: string;
    countryCode: string;
    region: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
  }): DtoOrderAddressSnapshot {
    return {
      recipientName: address.recipientName,
      phone: address.phone,
      countryCode: address.countryCode,
      region: address.region,
      city: address.city,
      postalCode: address.postalCode,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
    };
  }

  private _assertCheckoutCommand(command: DtoCheckoutCreate) {
    if (!command.correlationId.trim()) {
      this.app.throw(400, 'checkout correlationId is required');
    }
    if (command.correlationId.length > 80) {
      this.app.throw(400, 'checkout correlationId is too long');
    }
  }

  private _assertCommand(command: IOrderSnapshotCreateCommand) {
    if (!command.correlationId.trim()) {
      this.app.throw(400, 'order snapshot correlationId is required');
    }
    if (command.correlationId.length > 70) {
      this.app.throw(400, 'order snapshot correlationId is too long');
    }
    if (command.lines.length === 0) {
      this.app.throw(400, 'order snapshot requires at least one line');
    }
    if (new Set(command.lines.map(line => String(line.skuId))).size !== command.lines.length) {
      this.app.throw(400, 'order snapshot cannot contain duplicate SKUs');
    }
  }
}
