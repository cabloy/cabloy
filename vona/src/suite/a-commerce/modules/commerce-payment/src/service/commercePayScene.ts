import type { TableIdentity } from 'table-identity';
import type { IRefundOutcomeEvent, IPaymentOutcomeEvent } from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { EntityPaymentAttempt } from '../entity/paymentAttempt.tsx';

@Service()
export class ServiceCommercePayScene extends BeanBase {
  async createSession(attempt: EntityPaymentAttempt) {
    const session = await this.$scope.pay.service.paymentSession.create({
      userId: attempt.userId,
      payScene: 'commerce-order',
      businessReference: String(attempt.id),
      providerName: 'pay-mock:mock',
      clientName: 'default',
      environment: 'sandbox',
      amountMinor: attempt.amountCents,
      currency: attempt.currency,
      correlationId: `${attempt.correlationId}:session`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    await this.scope.model.paymentAttempt.updateById(attempt.id, {
      paymentSessionId: session.id,
      providerName: session.providerName,
    });
    return session;
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async acceptPaymentOutcome(event: IPaymentOutcomeEvent) {
    const attempt = await this.scope.model.paymentAttempt.getByIdForUpdate(event.businessReference);
    if (!attempt || String(attempt.paymentSessionId) !== String(event.paymentSessionId)) {
      this.app.throw(404, 'commerce payment attempt not found');
    }
    if (attempt.amountCents !== event.amountMinor || attempt.currency !== event.currency) {
      this.app.throw(409, 'commerce payment amount conflicts with the payment session');
    }
    if (attempt.state !== 'created') return attempt;
    await this.scope.model.paymentAttempt.updateById(attempt.id, {
      providerName: event.providerName,
      providerCaptureId: event.providerCaptureId,
    });
    return {
      ...attempt,
      providerName: event.providerName,
      providerCaptureId: event.providerCaptureId,
    };
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  async linkRefundOperation(refundAttemptId: TableIdentity, refundOperationId: TableIdentity) {
    const refundAttempt = await this.scope.model.refundAttempt.getByIdForUpdate(refundAttemptId);
    if (!refundAttempt) this.app.throw(404, 'commerce refund attempt not found');
    await this.scope.model.refundAttempt.updateById(refundAttempt.id, { refundOperationId });
    return { ...refundAttempt, refundOperationId };
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
