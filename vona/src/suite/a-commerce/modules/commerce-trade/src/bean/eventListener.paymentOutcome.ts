import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type { IPaymentOutcomeEvent } from 'vona-module-a-pay';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

@EventListener({ match: 'a-pay:paymentOutcome' })
export class EventListenerPaymentOutcome
  extends BeanBase
  implements IEventExecute<IPaymentOutcomeEvent, void>
{
  async execute(
    event: IPaymentOutcomeEvent,
    next: NextEvent<IPaymentOutcomeEvent, void>,
  ): Promise<void> {
    await this.scope.service.order.settlePaymentFromProvider(event);
    await next();
  }
}
