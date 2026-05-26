import type { TableIdentity } from 'table-identity';
import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

export interface TypeQueueMailJobData {
  mailId: TableIdentity;
}

export type TypeQueueMailJobResult = void;

@Queue({
  concurrency: true,
  options: {
    worker: {
      concurrency: 10,
    },
  },
})
export class QueueMail
  extends BeanQueueBase<TypeQueueMailJobData, TypeQueueMailJobResult>
  implements IQueueExecute<TypeQueueMailJobData, TypeQueueMailJobResult>
{
  async execute(
    data: TypeQueueMailJobData,
    _options?: IQueuePushOptions,
  ): Promise<TypeQueueMailJobResult> {
    await this.scope.service.mail.sendById(data.mailId);
  }
}
