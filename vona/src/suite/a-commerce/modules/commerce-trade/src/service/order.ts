import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { EntityPaymentAttempt } from 'vona-module-commerce-payment';

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
import type { DtoOrderSummary } from '../dto/orderSummary.tsx';
import type { DtoOrderView } from '../dto/orderView.tsx';
import type { DtoPaymentOutcomeCreate } from '../dto/paymentOutcomeCreate.tsx';
import type { DtoPaymentOutcomeResult } from '../dto/paymentOutcomeResult.tsx';
import type { EntityOrder } from '../entity/order.tsx';
import type { EntityOrderLine } from '../entity/orderLine.tsx';
import type { ModelOrder } from '../model/order.ts';

const maxOrderCents = 2_147_483_647;
const customerVisibleOrderStates: EntityOrder['state'][] = [
  'awaiting_payment',
  'paid',
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
    return await this.scope.model.order.getById(id);
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
    if (
      order.state !== 'awaiting_payment' &&
      order.state !== 'paid' &&
      order.state !== 'cancelled' &&
      order.state !== 'expired'
    ) {
      this.app.throw(409, 'order state is not available to customers');
    }
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
    operation: 'created' | 'paid' | 'cancelled' | 'expired';
    fromState?: 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';
    toState: 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';
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
      skuAttributesSnapshot: sku.attributes.map(
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
