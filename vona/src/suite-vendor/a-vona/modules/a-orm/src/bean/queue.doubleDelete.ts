import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

import type { IDatabaseClientRecord } from '../types/database.ts';
import type { ITableRecord } from '../types/onion/table.ts';

export interface TypeQueueDoubleDeleteJobData {
  beanFullName: string;
  clientName: keyof IDatabaseClientRecord;
  table?: keyof ITableRecord;
  method: 'cacheEntityDelInner' | 'cacheEntityClearInner' | 'cacheQueryClearInner';
  args: any[];
}

export type TypeQueueDoubleDeleteJobResult = void;

@Queue({
  options: { job: { delay: 3 * 1000 } },
})
export class QueueDoubleDelete
  extends BeanQueueBase<TypeQueueDoubleDeleteJobData, TypeQueueDoubleDeleteJobResult>
  implements IQueueExecute<TypeQueueDoubleDeleteJobData, TypeQueueDoubleDeleteJobResult>
{
  async execute(
    data: TypeQueueDoubleDeleteJobData,
    _options?: IQueuePushOptions,
  ): Promise<TypeQueueDoubleDeleteJobResult> {
    const beanInstance = this.app.bean._newBean(
      data.beanFullName as any,
      data.clientName,
      data.table,
    );
    await beanInstance[data.method](...data.args);
  }
}
