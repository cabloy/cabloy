import type { IStartupExecute } from 'vona-module-a-startup';

import { BeanBase } from 'vona';
import { Startup } from 'vona-module-a-startup';

@Startup({ instance: true, after: true })
export class StartupLoadQueueWorkers extends BeanBase implements IStartupExecute {
  async execute() {
    // load queue workers
    if (!this.app.meta.isTest) {
      this.scope.service.queue.loadQueueWorkers(this.ctx.instanceName);
    }
  }
}
