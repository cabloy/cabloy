import type { IPaymentOutcomeEvent } from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { PayScene } from 'vona-module-a-pay';

@PayScene({
  providers: [{ key: 'mock', providerName: 'pay-mock:mock', clientName: 'default' }],
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
}
