import type { IBeanRecord } from 'vona';
import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export interface TypeBroadcastReloadInstancesJobData {
  beanFullName: keyof IBeanRecord;
  data: unknown;
}

@Broadcast({ instance: false })
export class BroadcastReloadInstances
  extends BeanBroadcastBase<TypeBroadcastReloadInstancesJobData>
  implements IBroadcastExecute<TypeBroadcastReloadInstancesJobData>
{
  async execute(data: TypeBroadcastReloadInstancesJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      await this.bean.mutate.reloadInstancesWorker(data);
    }
  }
}
