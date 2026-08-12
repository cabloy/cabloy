import type {
  EntityPaymentSession,
  IPaymentOutcomeEvent,
  IRefundOutcomeEvent,
} from 'vona-module-a-pay';
import type { IPayProviderPaypalClientOptions } from 'vona-module-pay-paypal';
import type { IPayProviderStripeClientOptions } from 'vona-module-pay-stripe';

import { BeanBase } from 'vona';
import { PayScene } from 'vona-module-a-pay';

@PayScene({
  providers: [
    { key: 'mock', providerName: 'pay-mock:mock', clientName: 'default' },
    { key: 'paypal', providerName: 'pay-paypal:paypal', clientName: 'default' },
    { key: 'stripe', providerName: 'pay-stripe:stripe', clientName: 'default' },
  ],
  isProviderAvailable: (_ctx, input) => {
    if (input.candidate.key === 'mock') return true;
    const { clientOptions } = _ctx.bean.payProvider.resolveByName(
      input.candidate.providerName,
      input.candidate.clientName,
    );
    const server = _ctx.app.config.server.serve;
    const hasPublicServer = !!(server.protocol && server.host);
    if (input.candidate.key === 'paypal') {
      const options = clientOptions as IPayProviderPaypalClientOptions;
      return !!(
        options.secretCredential?.clientId &&
        options.secretCredential.clientSecret &&
        options.webhookId &&
        options.merchantReference &&
        hasPublicServer
      );
    }
    if (input.candidate.key === 'stripe') {
      const options = clientOptions as IPayProviderStripeClientOptions;
      return !!(options.secretCredential && options.secretWebhook && hasPublicServer);
    }
    return false;
  },
  resolveProvider: (_ctx, input) => {
    const mock = input.providers.find(item => item.key === 'mock');
    if (!mock) return input.providers[0]!.key;
    return mock.key;
  },
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
