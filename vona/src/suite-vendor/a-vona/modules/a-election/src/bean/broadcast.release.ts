import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export interface TypeBroadcastReleaseJobData {
  workerId: string;
  resource: string;
}

@Broadcast()
export class BroadcastRelease
  extends BeanBroadcastBase<TypeBroadcastReleaseJobData>
  implements IBroadcastExecute<TypeBroadcastReleaseJobData>
{
  async execute(data: TypeBroadcastReleaseJobData, _isEmitter?: boolean) {
    if (this.bean.worker.id === data.workerId) {
      await this.scope.service.election.release(data.resource);
    }
  }
}
