import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityCouponGrant } from '../entity/couponGrant.tsx';
import type { EntityCouponTemplate } from '../entity/couponTemplate.tsx';

export interface ICouponIssueCommand {
  templateId: TableIdentity;
  userId: TableIdentity;
  correlationId: string;
  reason: string;
}

export interface ICouponReserveCommand {
  couponGrantId: TableIdentity;
  userId: TableIdentity;
  orderId: TableIdentity;
  eligibleSubtotalCents: number;
  currency: 'USD';
  correlationId: string;
  reason: string;
}

export interface ICouponTransitionCommand {
  couponGrantId: TableIdentity;
  orderId: TableIdentity;
  correlationId: string;
  reason: string;
}

export interface ICouponReservationResult {
  couponGrant: EntityCouponGrant;
  discountCents: number;
}

const serializationRetryOptions = {
  retries: 1,
  factor: 1,
  minTimeout: 0,
  maxTimeout: 0,
  randomize: false,
  errorCodes: ['40001'],
  ownerOnly: true,
};

@Service()
export class ServiceCoupon extends BeanBase {
  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async issue(command: ICouponIssueCommand): Promise<EntityCouponGrant> {
    this._assertCommand(command);
    if (command.correlationId.length > 80) {
      this.app.throw(400, 'coupon issuance correlationId is too long');
    }
    const template = await this.scope.model.couponTemplate.getByIdForUpdate(command.templateId);
    if (!template) this.app.throw(404, 'coupon template not found');
    this._assertTemplateIssuable(template);
    const existing = await this.scope.model.couponGrant.get({
      couponCode: command.correlationId,
    });
    if (existing) {
      if (
        String(existing.templateId) !== String(command.templateId) ||
        String(existing.userId) !== String(command.userId)
      ) {
        this.app.throw(409, 'coupon issuance correlation conflicts with an existing grant');
      }
      return existing;
    }
    if (template.totalIssueLimit && template.issuedCount >= template.totalIssueLimit) {
      this.app.throw(409, 'coupon total issuance limit reached');
    }
    const perCustomerCount = Number(
      (await this.scope.model.couponGrant.count({
        where: { templateId: template.id, userId: command.userId },
      })) ?? 0,
    );
    if (template.perCustomerIssueLimit && perCustomerCount >= template.perCustomerIssueLimit) {
      this.app.throw(409, 'coupon per-customer issuance limit reached');
    }
    const grant = await this.scope.model.couponGrant.insert({
      templateId: template.id,
      userId: command.userId,
      couponCode: command.correlationId,
      state: 'available',
      templateNameSnapshot: template.name,
      currencySnapshot: template.currency,
      discountCentsSnapshot: template.discountCents,
      minSpendCentsSnapshot: template.minSpendCents,
      validFromSnapshot: template.validFrom,
      validUntilSnapshot: template.validUntil,
    });
    await this.scope.model.couponTemplate.updateById(template.id, {
      issuedCount: template.issuedCount + 1,
    });
    await this._appendAudit({
      grant,
      operation: 'issue',
      toState: 'available',
      correlationId: command.correlationId,
      reason: command.reason,
    });
    return grant;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async reserve(command: ICouponReserveCommand): Promise<ICouponReservationResult> {
    this._assertCommand(command);
    if (!Number.isSafeInteger(command.eligibleSubtotalCents) || command.eligibleSubtotalCents < 0) {
      this.app.throw(400, 'coupon eligible subtotal must be a non-negative integer');
    }
    const grant = await this.scope.model.couponGrant.getByIdForUpdate(command.couponGrantId);
    if (!grant || String(grant.userId) !== String(command.userId)) {
      this.app.throw(404, 'coupon grant not found');
    }
    if (grant.state === 'reserved') {
      if (
        String(grant.reservationOrderId) === String(command.orderId) &&
        grant.reservationCorrelationId === command.correlationId
      ) {
        return {
          couponGrant: grant,
          discountCents: Math.min(grant.discountCentsSnapshot, command.eligibleSubtotalCents),
        };
      }
      this.app.throw(409, 'coupon grant is already reserved');
    }
    if (grant.state !== 'available') {
      this.app.throw(409, `cannot reserve a ${grant.state} coupon grant`);
    }
    const template = await this.scope.model.couponTemplate.getByIdForUpdate(grant.templateId);
    if (!template) this.app.throw(404, 'coupon template not found');
    this._assertTemplateReservable(template, grant);
    const reservedCount = Number(
      (await this.scope.model.couponGrant.count({
        where: { templateId: template.id, state: 'reserved' },
      })) ?? 0,
    );
    if (
      template.totalUsageLimit &&
      template.redeemedCount + reservedCount >= template.totalUsageLimit
    ) {
      this.app.throw(409, 'coupon total usage limit reached');
    }
    if (grant.currencySnapshot !== command.currency) {
      this.app.throw(409, 'coupon currency does not match the order');
    }
    if (command.eligibleSubtotalCents < grant.minSpendCentsSnapshot) {
      this.app.throw(409, 'coupon minimum spend is not met');
    }
    const existingOrderGrant = await this.scope.model.couponGrant.getForUpdate({
      reservationOrderId: command.orderId,
    });
    if (existingOrderGrant && String(existingOrderGrant.id) !== String(grant.id)) {
      this.app.throw(409, 'an order can reserve only one coupon');
    }
    const reservedAt = new Date();
    await this.scope.model.couponGrant.updateById(grant.id, {
      state: 'reserved',
      reservationOrderId: command.orderId,
      reservationCorrelationId: command.correlationId,
      reservedAt,
    });
    const reservedGrant = {
      ...grant,
      state: 'reserved' as const,
      reservationOrderId: command.orderId,
      reservationCorrelationId: command.correlationId,
      reservedAt,
    };
    await this._appendAudit({
      grant: reservedGrant,
      operation: 'reserve',
      fromState: 'available',
      toState: 'reserved',
      orderId: command.orderId,
      correlationId: command.correlationId,
      reason: command.reason,
    });
    return {
      couponGrant: reservedGrant,
      discountCents: Math.min(grant.discountCentsSnapshot, command.eligibleSubtotalCents),
    };
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async release(command: ICouponTransitionCommand): Promise<EntityCouponGrant> {
    return await this._transition(command, 'available');
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async redeem(command: ICouponTransitionCommand): Promise<EntityCouponGrant> {
    return await this._transition(command, 'redeemed');
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async expireAvailable(now = new Date()): Promise<number> {
    const grants = await this.scope.model.couponGrant.select({
      where: { state: 'available' },
    });
    let expired = 0;
    for (const grant of grants) {
      if (grant.validUntilSnapshot > now) continue;
      const lockedGrant = await this.scope.model.couponGrant.getByIdForUpdate(grant.id);
      if (
        !lockedGrant ||
        lockedGrant.state !== 'available' ||
        lockedGrant.validUntilSnapshot > now
      ) {
        continue;
      }
      await this.scope.model.couponGrant.updateById(lockedGrant.id, { state: 'expired' });
      await this._appendAudit({
        grant: lockedGrant,
        operation: 'expire',
        fromState: 'available',
        toState: 'expired',
        correlationId: `coupon-expiry:${lockedGrant.id}:${lockedGrant.validUntilSnapshot.toISOString()}`,
        reason: 'coupon validity expired',
      });
      expired++;
    }
    return expired;
  }

  async mine(): Promise<EntityCouponGrant[]> {
    const now = new Date();
    return await this.scope.model.couponGrant
      .select({
        where: { userId: this._getCurrentUserId(), state: 'available' },
        orders: [['validUntilSnapshot', 'asc']],
      })
      .then(grants =>
        grants.filter(grant => grant.validFromSnapshot <= now && grant.validUntilSnapshot > now),
      );
  }

  private async _transition(
    command: ICouponTransitionCommand,
    targetState: 'available' | 'redeemed',
  ): Promise<EntityCouponGrant> {
    this._assertCommand(command);
    const grant = await this.scope.model.couponGrant.getByIdForUpdate(command.couponGrantId);
    if (!grant) this.app.throw(404, 'coupon grant not found');
    const currentOrderId =
      targetState === 'redeemed'
        ? (grant.redeemedOrderId ?? grant.reservationOrderId)
        : grant.reservationOrderId;
    if (String(currentOrderId) !== String(command.orderId)) {
      if (targetState === 'available') {
        const releasedAudit = await this.scope.model.couponAudit.get({
          couponGrantId: grant.id,
          operation: 'release',
          orderId: command.orderId,
          correlationId: command.correlationId,
        });
        if (releasedAudit && (grant.state === 'available' || grant.state === 'expired'))
          return grant;
      }
      this.app.throw(404, 'coupon grant reservation not found');
    }
    if (grant.state === targetState) return grant;
    if (grant.state !== 'reserved') {
      this.app.throw(
        409,
        `cannot ${targetState === 'redeemed' ? 'redeem' : 'release'} a ${grant.state} coupon grant`,
      );
    }
    if (targetState === 'redeemed') {
      const template = await this.scope.model.couponTemplate.getByIdForUpdate(grant.templateId);
      if (!template) this.app.throw(404, 'coupon template not found');
      if (template.totalUsageLimit && template.redeemedCount >= template.totalUsageLimit) {
        this.app.throw(409, 'coupon total usage limit reached');
      }
      const redeemedAt = new Date();
      await this.scope.model.couponGrant.updateById(grant.id, {
        state: 'redeemed',
        redeemedOrderId: command.orderId,
        redeemedAt,
      });
      await this.scope.model.couponTemplate.updateById(template.id, {
        redeemedCount: template.redeemedCount + 1,
      });
      const redeemedGrant = {
        ...grant,
        state: 'redeemed' as const,
        redeemedOrderId: command.orderId,
        redeemedAt,
      };
      await this._appendAudit({
        grant: redeemedGrant,
        operation: 'redeem',
        fromState: 'reserved',
        toState: 'redeemed',
        orderId: command.orderId,
        correlationId: command.correlationId,
        reason: command.reason,
      });
      return redeemedGrant;
    }
    const now = new Date();
    const expired = grant.validUntilSnapshot <= now;
    const releasedGrant = {
      ...grant,
      state: (expired ? 'expired' : 'available') as EntityCouponGrant['state'],
      reservationOrderId: undefined,
      reservationCorrelationId: undefined,
      reservedAt: undefined,
    };
    await this.scope.model.couponGrant.updateById(grant.id, {
      state: releasedGrant.state,
      reservationOrderId: undefined,
      reservationCorrelationId: undefined,
      reservedAt: undefined,
    });
    await this._appendAudit({
      grant: releasedGrant,
      operation: 'release',
      fromState: 'reserved',
      toState: releasedGrant.state,
      orderId: command.orderId,
      correlationId: command.correlationId,
      reason: command.reason,
    });
    return releasedGrant;
  }

  private async _appendAudit({
    grant,
    operation,
    fromState,
    toState,
    orderId,
    correlationId,
    reason,
  }: {
    grant: EntityCouponGrant;
    operation: 'issue' | 'reserve' | 'release' | 'redeem' | 'expire';
    fromState?: EntityCouponGrant['state'];
    toState: EntityCouponGrant['state'];
    orderId?: TableIdentity;
    correlationId: string;
    reason: string;
  }) {
    await this.scope.model.couponAudit.insert({
      couponGrantId: grant.id,
      templateId: grant.templateId,
      userId: grant.userId,
      orderId,
      actorId: this.bean.passport.currentUser?.anonymous
        ? undefined
        : this.bean.passport.currentUser?.id,
      operation,
      fromState,
      toState,
      correlationId,
      reason,
    });
  }

  private _assertTemplateIssuable(template: EntityCouponTemplate | undefined) {
    if (!template) this.app.throw(404, 'coupon template not found');
    const now = new Date();
    if (template.state !== 'active' || template.validFrom > now || template.validUntil <= now) {
      this.app.throw(409, 'coupon template is not currently issuable');
    }
  }

  private _assertTemplateReservable(
    template: EntityCouponTemplate | undefined,
    grant: EntityCouponGrant,
  ) {
    if (!template) this.app.throw(404, 'coupon template not found');
    const now = new Date();
    if (
      template.state !== 'active' ||
      grant.validFromSnapshot > now ||
      grant.validUntilSnapshot <= now
    ) {
      this.app.throw(409, 'coupon grant is not currently reservable');
    }
  }

  private _getCurrentUserId(): TableIdentity {
    return this.bean.passport.currentUser!.id;
  }

  private _assertCommand(command: { correlationId: string; reason: string }) {
    if (!command.correlationId?.trim()) this.app.throw(400, 'coupon correlationId is required');
    if (command.correlationId.length > 100) this.app.throw(400, 'coupon correlationId is too long');
    if (!command.reason?.trim()) this.app.throw(400, 'coupon reason is required');
  }
}
