import type { IScheduleExecute } from 'vona-module-a-schedule';

import { BeanBase } from 'vona';
import { Schedule } from 'vona-module-a-schedule';

const ExpiryBatchLimit = 100;

@Schedule({ repeat: { every: 60 * 1000 } })
export class BeanScheduleOrderExpiry extends BeanBase implements IScheduleExecute {
  async execute() {
    const orders = await this.scope.model.order.select({
      where: {
        state: 'awaiting_payment',
        reservationExpiresAt: { _lte_: new Date() },
      },
      orders: [
        ['reservationExpiresAt', 'asc'],
        ['id', 'asc'],
      ],
      limit: ExpiryBatchLimit,
    });
    for (const order of orders) {
      await this.scope.service.order.expireIfDue(order.id);
    }
  }
}
