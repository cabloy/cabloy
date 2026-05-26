import type { IInstanceRecord } from 'vona';
import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export type TypeBroadcastReloadJobData = keyof IInstanceRecord;

@Broadcast({ instance: false })
export class BroadcastReload
  extends BeanBroadcastBase<TypeBroadcastReloadJobData>
  implements IBroadcastExecute<TypeBroadcastReloadJobData>
{
  async execute(data: TypeBroadcastReloadJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      await this.bean.instance.reloadWorker(data);
    }
  }
}
