import type {
  EntityPaymentSession,
  IPaymentOutcomeEvent,
  IRefundOutcomeEvent,
} from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { PayScene } from 'vona-module-a-pay';

@PayScene({
  providers: [
    { key: 'mock', providerName: 'pay-mock:mock', clientName: 'default' },
    { key: 'paypal', providerName: 'pay-paypal:paypal', clientName: 'default' },
  ],
  isProviderAvailable: (_ctx, input) => {
    if (input.candidate.key === 'mock') return true;
    if (input.candidate.key !== 'paypal') return false;
    const { clientOptions } = _ctx.bean.payProvider.resolveByName(
      input.candidate.providerName,
      input.candidate.clientName,
    );
    const options = clientOptions as {
      secretCredential?: { clientId?: string; clientSecret?: string };
      webhookId?: string;
      merchantReference?: string;
    };
    const server = _ctx.app.config.server.serve;
    return !!(
      options.secretCredential?.clientId &&
      options.secretCredential.clientSecret &&
      options.webhookId &&
      options.merchantReference &&
      server.protocol &&
      server.host
    );
  },
  resolveProvider: (_ctx, input) =>
    input.providers.find(item => item.key === 'mock')?.key ?? input.providers[0]!.key,
  currencies: ['USD'],
  captureMode: 'automatic',
  sessionExpiresIn: 30 * 60 * 1000,
  refund: {
    enabled: true,
    allowPartial: true,
  },
})
export class PaySceneCommerceOrder extends BeanBase {
  async getPaymentCallbackPath(session: EntityPaymentSession): Promise<string> {
    const attempt = await this.scope.model.paymentAttempt.get({ paymentSessionId: session.id });
    if (!attempt) this.app.throw(404, 'commerce payment attempt not found');
    return `/commerce/payment/${session.id}/${attempt.orderId}`;
  }

  async onPaymentOutcome(event: IPaymentOutcomeEvent): Promise<void> {
    await this.$scope.commerceTrade.service.order.settlePaymentFromProvider(event);
  }

  async onRefundOutcome(event: IRefundOutcomeEvent): Promise<void> {
    if (event.businessReference.startsWith('late-capture:')) return;
    await this.$scope.commerceTrade.service.order.settleRefundFromProvider(event);
  }
}
