import type { IScheduleExecute, TypeScheduleJob } from 'vona-module-a-schedule';

import { BeanBase } from 'vona';
import { Schedule } from 'vona-module-a-schedule';

@Schedule({
  enable: false,
  repeat: { every: 5000 },
  templateOptions: {
    removeOnComplete: { count: 10 },
    removeOnFail: { count: 10 },
  },
})
export class ScheduleTest3 extends BeanBase implements IScheduleExecute {
  async execute(job?: TypeScheduleJob) {
    this.$logger.silly(
      `Schedule Test3: iid=${this.ctx.instance.id}, every=${job?.data.options?.jobOptions?.repeat?.every}, ${new Date()}`,
    );
  }
}
