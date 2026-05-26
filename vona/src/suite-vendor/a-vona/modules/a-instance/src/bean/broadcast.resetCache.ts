import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export type TypeBroadcastResetCacheJobData = unknown;

@Broadcast()
export class BroadcastResetCache
  extends BeanBroadcastBase<TypeBroadcastResetCacheJobData>
  implements IBroadcastExecute<TypeBroadcastResetCacheJobData>
{
  async execute(_data: TypeBroadcastResetCacheJobData, _isEmitter?: boolean) {
    await this.scope.service.instance.resetCache(this.ctx.instanceName!);
  }
}
