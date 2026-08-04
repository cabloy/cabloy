import type { IPaymentOutcomeEvent, IRefundOutcomeEvent } from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { PayScene } from 'vona-module-a-pay';

@PayScene({
  providers: [
    { key: 'mock', providerName: 'pay-mock:mock', clientName: 'default' },
    { key: 'paypal', providerName: 'pay-paypal:paypal', clientName: 'default' },
  ],
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
  async onPaymentOutcome(event: IPaymentOutcomeEvent): Promise<void> {
    await this.$scope.commerceTrade.service.order.settlePaymentFromProvider(event);
  }

  async onRefundOutcome(event: IRefundOutcomeEvent): Promise<void> {
    await this.$scope.commerceTrade.service.order.settleRefundFromProvider(event);
  }
}
