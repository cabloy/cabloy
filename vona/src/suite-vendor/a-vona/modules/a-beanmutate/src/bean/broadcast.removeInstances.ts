import type { IBeanRecord } from 'vona';
import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export interface TypeBroadcastRemoveInstancesJobData {
  beanFullName: keyof IBeanRecord;
  data: unknown;
}

@Broadcast({ instance: false })
export class BroadcastRemoveInstances
  extends BeanBroadcastBase<TypeBroadcastRemoveInstancesJobData>
  implements IBroadcastExecute<TypeBroadcastRemoveInstancesJobData>
{
  async execute(data: TypeBroadcastRemoveInstancesJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      await this.bean.mutate.removeInstancesWorker(data);
    }
  }
}
