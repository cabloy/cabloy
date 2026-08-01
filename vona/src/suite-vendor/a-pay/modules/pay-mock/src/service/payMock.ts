import type { TableIdentity } from 'table-identity';

import { createHmac, randomUUID } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

export type TypeMockPaymentOutcome = 'succeeded' | 'failed' | 'cancelled';

@Service()
export class ServicePayMock extends BeanBase {
  async completePaymentSession(paymentSessionId: TableIdentity, outcome: TypeMockPaymentOutcome) {
    this._assertSimulatorEnabled();
    const session = await this.$scope.pay.model.paymentSession.getById(paymentSessionId);
    if (!session || String(session.userId) !== String(this.bean.passport.currentUser!.id)) {
      this.app.throw(404, 'payment session not found');
    }
    if (
      session.providerName !== 'pay-mock:mock' ||
      session.clientName !== 'default' ||
      session.environment !== 'sandbox'
    ) {
      this.app.throw(404, 'mock payment session not found');
    }
    if (session.state !== 'requires_action') {
      this.app.throw(409, 'mock payment session is not actionable');
    }
    if (session.expiresAt <= new Date()) {
      this.app.throw(409, 'payment session is expired');
    }
    const { clientOptions } = this.bean.payProvider.resolveByName(
      session.providerName,
      session.clientName,
    );
    if (clientOptions.environment !== session.environment) {
      this.app.throw(500, 'mock payment provider environment is inconsistent');
    }
    const secret = clientOptions.secretWebhook;
    if (typeof secret !== 'string' || !secret) {
      this.app.throw(500, 'mock webhook secret is not configured');
    }

    const rawBody = JSON.stringify({
      eventId: `mock-payment-${randomUUID()}`,
      eventType: `payment.${outcome}`,
      paymentSessionId: String(session.id),
      state: outcome,
      amountMinor: session.amountMinor,
      currency: session.currency,
      providerPaymentId: session.providerPaymentId ?? `mock-payment-${session.id}`,
      ...(outcome === 'succeeded' ? { providerCaptureId: `mock-capture-${session.id}` } : {}),
    });
    const signature = createHmac('sha256', secret).update(rawBody).digest('hex');
    const response = await fetch(
      this.app.util.getAbsoluteUrlByApiPath(
        `/pay/webhook/${session.providerName}/${session.clientName}`,
      ),
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-pay-mock-signature': signature,
        },
        body: rawBody,
      },
    );
    if (!response.ok) this.app.throw(502, 'mock payment webhook was rejected');
    return { paymentSessionId: session.id, accepted: true as const };
  }

  private _assertSimulatorEnabled() {
    if (
      this.app.meta.env.META_MODE === 'prod' ||
      !this.scope.config.mock.enabled ||
      (this.ctx.instanceName ?? '') !== ''
    ) {
      this.app.throw(404, 'mock payment simulator is unavailable');
    }
  }
}
