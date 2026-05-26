import type { IStartupExecute } from 'vona-module-a-startup';

import { BeanBase } from 'vona';
import { Startup } from 'vona-module-a-startup';

@Startup({
  instance: true,
  debounce: true,
  after: true,
})
export class StartupLoadSchedules extends BeanBase implements IStartupExecute {
  async execute() {
    await this.$scope.schedule.service.schedule.loadSchedules();
  }
}
