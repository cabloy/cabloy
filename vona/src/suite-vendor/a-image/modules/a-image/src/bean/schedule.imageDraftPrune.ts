import type { IScheduleExecute } from 'vona-module-a-schedule';

import { BeanBase } from 'vona';
import { Schedule } from 'vona-module-a-schedule';

@Schedule({ repeat: { every: 30 * 60 * 1000 } })
export class ScheduleImageDraftPrune extends BeanBase implements IScheduleExecute {
  async execute() {
    const items = await this.scope.model.image.select({
      where: {
        status: 'draft',
        draftExpiresAt: {
          _lt_: new Date(),
        },
      },
    });
    for (const item of items) {
      await this.bean.image.expireDraftImage(item.id);
    }
  }
}
