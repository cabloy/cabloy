import type * as Bull from 'bullmq';
import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';
import type { IDbInfo } from 'vona-module-a-orm';
import type { IQueueJobContext, IQueueRecord } from 'vona-module-a-queue';

import type {
  TypeQueueScheduleJobData,
  TypeQueueScheduleJobResult,
} from '../bean/queue.schedule.ts';

export type TypeScheduleJob = Bull.Job<
  IQueueJobContext<TypeQueueScheduleJobData>,
  TypeQueueScheduleJobResult
>;

export interface IScheduleExecute {
  execute: (job?: TypeScheduleJob) => Promise<void>;
}

export interface IScheduleRecord {}

export interface IDecoratorScheduleOptions extends TypeOnionOptionsEnableSimple {
  queue?: keyof IQueueRecord;
  repeat: Bull.RepeatOptions;
  templateOptions?: Bull.JobSchedulerTemplateOptions;
  transaction?: boolean;
  dbInfo?: IDbInfo;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    schedule: ServiceOnion<IScheduleRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    schedule: OmitNever<IScheduleRecord>;
  }

  export interface IBeanSceneRecord {
    schedule: never;
  }
}
