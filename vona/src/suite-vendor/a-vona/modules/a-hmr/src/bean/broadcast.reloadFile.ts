import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { TypeHmrWatchScene } from '../types/hmr.ts';

export interface TypeBroadcastReloadFileJobData {
  sceneName: TypeHmrWatchScene;
  file: string;
}

@Broadcast()
export class BroadcastReloadFile
  extends BeanBroadcastBase<TypeBroadcastReloadFileJobData>
  implements IBroadcastExecute<TypeBroadcastReloadFileJobData>
{
  async execute(data: TypeBroadcastReloadFileJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      await this.scope.service.watch._reloadFileWorker(data);
    }
  }
}
