import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { cast } from 'vona';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { IDatabaseClientRecord } from '../types/database.ts';

export interface TypeBroadcastColumnsClearJobData {
  clientName?: keyof IDatabaseClientRecord;
  tableName?: string;
}

@Broadcast()
export class BroadcastColumnsClear
  extends BeanBroadcastBase<TypeBroadcastColumnsClearJobData>
  implements IBroadcastExecute<TypeBroadcastColumnsClearJobData>
{
  async execute(data: TypeBroadcastColumnsClearJobData, isEmitter?: boolean) {
    const { clientName, tableName } = data;
    if (!isEmitter) {
      await cast(this.scope.service.database).columnsClearWorker(clientName, tableName);
    }
  }
}
