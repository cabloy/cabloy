import type Redlock from '@sesamecare-oss/redlock';
import type * as Bull from 'bullmq';
import type { OmitNever, PowerPartial } from 'vona';
import type { IGeneralInfoOptions } from 'vona-module-a-executor';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';
import type { IRedlockClientOptions } from 'vona-module-a-redlock';

export interface IQueuePushOptions extends IGeneralInfoOptions {
  queueNameSub?: string;
  jobName?: string;
  jobOptions?: Bull.JobsOptions;
}

export type TypeQueueJob<DATA = unknown, RESULT = unknown> = Bull.Job<
  IQueueJobContext<DATA>,
  RESULT
>;
export interface IQueueExecute<DATA = unknown, RESULT = unknown> {
  execute: (
    data: DATA,
    options?: IQueuePushOptions,
    job?: TypeQueueJob<DATA, RESULT>,
  ) => Promise<RESULT>;
}

export interface IQueueJobContext<DATA> {
  queueName: keyof IQueueRecord;
  data: DATA;
  options?: IQueuePushOptions;
}

export interface IQueueWork {
  redlock: Redlock.Redlock;
  worker: Bull.Worker;
  workerOptions: Bull.WorkerOptions;
}
export interface IQueueWorks {
  [queueKey: string]: IQueueWork;
}

export interface IQueueQueue {
  config?: IDecoratorQueueOptions;
  options: Bull.QueueOptions;
  queue: Bull.Queue;
  queueEvents: Bull.QueueEvents;
  queueEventsOptions: Bull.QueueEventsOptions;
  queueEventsReady?: boolean;
}

export interface IQueueQueues {
  [queueKey: string]: IQueueQueue;
}

export interface IQueueCallback<DATA, RESULT> {
  info: IQueueJobContext<DATA>;
  callback: (err: Error | undefined, data: RESULT | undefined) => void;
}

export interface IQueueCallbacks {
  [jobId: string | number]: IQueueCallback<unknown, unknown>;
}

export interface IQueueRecord {}

export interface IDecoratorQueueOptions extends TypeOnionOptionsEnableSimple {
  concurrency?: boolean;
  transaction?: boolean;
  options?: {
    queue?: Partial<Bull.QueueOptions>;
    worker?: Partial<Bull.WorkerOptions>;
    redlock?: PowerPartial<IRedlockClientOptions> & { lockTTL?: number };
    job?: Bull.JobsOptions;
  };
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    queue: ServiceOnion<IQueueRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    queue: OmitNever<IQueueRecord>;
  }

  export interface IBeanSceneRecord {
    queue: never;
  }
}
