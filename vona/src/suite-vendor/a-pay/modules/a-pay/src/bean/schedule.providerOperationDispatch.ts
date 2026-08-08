import type { IScheduleExecute } from 'vona-module-a-schedule';

import { BeanBase } from 'vona';
import { Schedule } from 'vona-module-a-schedule';

@Schedule({ repeat: { every: 5 * 1000 } })
export class ScheduleProviderOperationDispatch extends BeanBase implements IScheduleExecute {
  async execute() {
    await this.scope.service.providerOperation.queueDue();
  }
}
