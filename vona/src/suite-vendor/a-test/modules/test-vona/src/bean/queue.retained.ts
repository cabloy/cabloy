import type { IQueueExecute, IQueuePushOptions, TypeQueueJob } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

import type { TypeQueueTestJobData, TypeQueueTestJobResult } from './queue.test.ts';

@Queue({
  options: {
    worker: {
      removeOnComplete: { count: 10 },
      removeOnFail: { count: 10 },
    },
  },
})
export class QueueRetained
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
    return data.a + data.b;
  }
}
