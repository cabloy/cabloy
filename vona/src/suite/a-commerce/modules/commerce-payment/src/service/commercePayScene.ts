import type { TableIdentity } from 'table-identity';
import type { IRefundOutcomeEvent } from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentAttempt } from '../entity/paymentAttempt.tsx';

@Service()
export class ServiceCommercePayScene extends BeanBase {
  async createSession(attempt: EntityPaymentAttempt) {
    const session = await this.$scope.pay.service.paymentSession.create({
      userId: attempt.userId,
      payScene: 'commerce-payment:commerceOrder',
      businessReference: String(attempt.id),
      amountMinor: attempt.amountCents,
      currency: attempt.currency,
      correlationId: `${attempt.correlationId}:session`,
    });
    await this.scope.model.paymentAttempt.updateById(attempt.id, {
      paymentSessionId: session.id,
      providerName: session.providerName,
    });
    return session;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async linkRefundOperation(refundAttemptId: TableIdentity, refundOperationId: TableIdentity) {
    const refundAttempt = await this.scope.model.refundAttempt.getByIdForUpdate(refundAttemptId);
    if (!refundAttempt) this.app.throw(404, 'commerce refund attempt not found');
    if (
      refundAttempt.refundOperationId &&
      String(refundAttempt.refundOperationId) !== String(refundOperationId)
    ) {
      this.app.throw(409, 'commerce refund attempt is linked to another refund operation');
    }
    await this.scope.model.refundAttempt.updateById(refundAttempt.id, { refundOperationId });
    return { ...refundAttempt, refundOperationId };
  }

  async createRefundOperation(refundAttemptId: TableIdentity) {
    const refundAttempt = await this.scope.model.refundAttempt.getById(refundAttemptId);
    if (!refundAttempt) this.app.throw(404, 'commerce refund attempt not found');
    const paymentAttempt = await this.scope.model.paymentAttempt.get({
      orderId: refundAttempt.orderId,
    });
    if (!paymentAttempt?.paymentSessionId)
      this.app.throw(409, 'commerce payment session is unavailable');
    const refund = await this.$scope.pay.service.refundOperation.create({
      paymentSessionId: paymentAttempt.paymentSessionId,
      businessReference: String(refundAttempt.id),
      amountMinor: refundAttempt.amountCents,
      currency: refundAttempt.currency,
      idempotencyKey: `${refundAttempt.correlationId}:refund`,
      correlationId: refundAttempt.correlationId,
    });
    await this.linkRefundOperation(refundAttempt.id, refund.id);
    return refund;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async acceptRefundOutcome(event: IRefundOutcomeEvent) {
    const refundAttempt = await this.scope.model.refundAttempt.getForUpdate({
      refundOperationId: event.refundOperationId,
    });
    if (!refundAttempt) this.app.throw(404, 'commerce refund attempt not found');
    if (
      refundAttempt.amountCents !== event.amountMinor ||
      refundAttempt.currency !== event.currency
    ) {
      this.app.throw(409, 'commerce refund amount conflicts with the refund operation');
    }
    if (refundAttempt.state !== 'created') return refundAttempt;
    await this.scope.model.refundAttempt.updateById(refundAttempt.id, {
      providerRefundId: event.providerRefundId,
    });
    return { ...refundAttempt, providerRefundId: event.providerRefundId };
  }
}
