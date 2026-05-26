import type { ILoggerClientRecord, LoggerLevel } from 'vona';
import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export interface TypeBroadcastSetFilterLevelJobData {
  level: LoggerLevel | boolean;
  clientName?: keyof ILoggerClientRecord;
}

@Broadcast({ instance: false })
export class BroadcastSetFilterLevel
  extends BeanBroadcastBase<TypeBroadcastSetFilterLevelJobData>
  implements IBroadcastExecute<TypeBroadcastSetFilterLevelJobData>
{
  async execute(data: TypeBroadcastSetFilterLevelJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      this.app.meta.logger.setFilterLevel(data.level, data.clientName);
    }
  }
}
