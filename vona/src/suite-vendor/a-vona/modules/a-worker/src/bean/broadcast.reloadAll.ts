import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export type TypeBroadcastReloadAllJobData = unknown;

@Broadcast({ instance: false })
export class BroadcastReloadAll
  extends BeanBroadcastBase<TypeBroadcastReloadAllJobData>
  implements IBroadcastExecute<TypeBroadcastReloadAllJobData>
{
  async execute(_data: TypeBroadcastReloadAllJobData, _isEmitter?: boolean) {
    this.bean.worker.reload();
  }
}
