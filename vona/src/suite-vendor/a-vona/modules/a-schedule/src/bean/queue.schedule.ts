import type { IQueueExecute, IQueuePushOptions } from 'vona-module-a-queue';

import { BeanQueueBase, Queue } from 'vona-module-a-queue';

import type { IScheduleRecord, TypeScheduleJob } from '../types/schedule.ts';

export interface TypeQueueScheduleJobData {
  scheduleName: keyof IScheduleRecord;
}

export type TypeQueueScheduleJobResult = void;

@Queue()
export class QueueSchedule
  extends BeanQueueBase<TypeQueueScheduleJobData, TypeQueueScheduleJobResult>
  implements IQueueExecute<TypeQueueScheduleJobData, TypeQueueScheduleJobResult>
{
  async execute(
    data: TypeQueueScheduleJobData,
    _options?: IQueuePushOptions,
    job?: TypeScheduleJob,
  ): Promise<TypeQueueScheduleJobResult> {
    await this.scope.service.schedule.execute(data.scheduleName, job);
  }
}
