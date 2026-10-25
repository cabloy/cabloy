import type { IQueueExecute, IQueuePushOptions, TypeQueueJob } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

export interface TypeQueueTestJobData {
  a: number;
  b: number;
  failAttempts?: number;
}

export type TypeQueueTestJobResult = number;

@Queue()
export class QueueTest
  extends BeanQueueBase<TypeQueueTestJobData, TypeQueueTestJobResult>
  implements IQueueExecute<TypeQueueTestJobData, TypeQueueTestJobResult>
{
  async execute(
    data: TypeQueueTestJobData,
    _options?: IQueuePushOptions,
    job?: TypeQueueJob<TypeQueueTestJobData, TypeQueueTestJobResult>,
  ): Promise<TypeQueueTestJobResult> {
    if (job && job.attemptsMade < (data.failAttempts ?? 0)) {
      throw new Error('queue test failure');
    }
    const res = data.a + data.b;
    this.$logger.silly(`queue test worker done: ${data.a} + ${data.b} = ${res}`);
    return res;
  }
}
