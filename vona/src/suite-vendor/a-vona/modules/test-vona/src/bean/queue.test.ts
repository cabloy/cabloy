import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

export interface TypeQueueTestJobData {
  a: number;
  b: number;
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
  ): Promise<TypeQueueTestJobResult> {
    const res = data.a + data.b;
    this.$logger.silly(`queue test worker done: ${data.a} + ${data.b} = ${res}`);
    return res;
  }
}
