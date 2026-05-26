import type { ILoggerClientRecord } from 'vona';
import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export interface TypeBroadcastSetFilterChildJobData {
  child: string | string[];
  clientName?: keyof ILoggerClientRecord;
}

@Broadcast()
export class BroadcastSetFilterChild
  extends BeanBroadcastBase<TypeBroadcastSetFilterChildJobData>
  implements IBroadcastExecute<TypeBroadcastSetFilterChildJobData>
{
  async execute(data: TypeBroadcastSetFilterChildJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      this.app.meta.logger.setFilterChild(data.child, data.clientName);
    }
  }
}
