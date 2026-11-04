import type { IInstanceRecord, TestAsyncCompletion, TestAsyncCompletionTicket } from 'vona';

import * as Bull from 'bullmq';
import {
  BeanBase,
  beanFullNameFromOnionName,
  deepExtend,
  getTestAsyncCompletion,
  instanceDesp,
  uuidv4,
  withoutTestAsyncCompletion,
} from 'vona';
import { Service } from 'vona-module-a-bean';
import { getRedisClientKeyPrefix } from 'vona-module-a-redis';

import type {
  IQueueCallbacks,
  IQueueExecute,
  IQueueJobContext,
  IQueuePushOptions,
  IQueueQueue,
  IQueueQueues,
  IQueueRecord,
  IQueueWork,
  IQueueWorks,
  TypeQueueJob,
} from '../types/queue.ts';

interface IOwnedQueueJob {
  owner: TestAsyncCompletion;
  ticket: TestAsyncCompletionTicket;
  prefix: string;
  queueKey: string;
  jobId: string;
  executions: number;
  terminal?: { error?: Error };
}

interface IOwnedQueueHandles {
  prefix: string;
  worker?: IQueueWork;
  queue?: IQueueQueue;
}

@Service()
export class ServiceQueue extends BeanBase {
  _workers: IQueueWorks = {};
  _queues: IQueueQueues = {};
  _queueCallbacks: IQueueCallbacks = {};
  private _ownedJobs = new Map<string, IOwnedQueueJob>();
  private _ownedHandles = new Map<TestAsyncCompletion, Map<string, IOwnedQueueHandles>>();

  push<DATA>(info: IQueueJobContext<DATA>): Promise<void> {
    if (!info.options?.dbInfo) throw new Error('should specify the options.dbInfo');
    return this._queuePush(info, false);
  }

  // { locale, instanceName, module, queueName,queueNameSub,data }
  pushAsync<DATA, RESULT>(info: IQueueJobContext<DATA>): Promise<RESULT> {
    if (!info.options?.dbInfo) throw new Error('should specify the options.dbInfo');
    return this._queuePush(info, true);
  }

  loadQueueWorkers(instanceName?: keyof IInstanceRecord | undefined | null) {
    for (const queueItem of this.bean.onion.queue.getOnionsEnabledCached()) {
      const info: IQueueJobContext<unknown> = {
        queueName: queueItem.name as never,
        data: undefined as any,
        options: {
          instanceName,
        },
      };
      this._ensureWorker(info);
    }
  }

  async clearWorkers() {
    for (const queueKey in this._workers) {
      const _worker = this._workers[queueKey];
      await _worker.worker.close();
    }
    this._workers = {};
  }

  async clearQueues() {
    for (const queueKey in this._queues) {
      const _queue = this._queues[queueKey];
      await _queue.queue.close();
      await _queue.queueEvents.close();
    }
    this._queues = {};
  }

  async releaseOwnedInstanceHandles(owner: TestAsyncCompletion): Promise<void> {
    if (owner.app !== this.app) throw new Error('Queue completion owner belongs to another app');
    owner.assertSettled();
    for (const job of this._ownedJobs.values()) {
      if (job.owner === owner) throw new Error(`Owned queue job is still pending: ${job.jobId}`);
    }
    const handles = this._ownedHandles.get(owner);
    if (!handles) return;
    for (const [queueKey, entry] of handles) {
      if (
        entry.prefix !== this._getPrefix() ||
        (entry.worker && this._workers[queueKey] !== entry.worker) ||
        (entry.queue && this._queues[queueKey] !== entry.queue)
      ) {
        throw new Error(`Owned queue handles changed: ${queueKey}`);
      }
    }
    for (const [queueKey, entry] of handles) {
      if (entry.worker) {
        await entry.worker.worker.close();
        delete this._workers[queueKey];
        entry.worker = undefined;
      }
      if (entry.queue) {
        await entry.queue.queue.close();
        await entry.queue.queueEvents.close();
        delete this._queues[queueKey];
        entry.queue = undefined;
      }
    }
    this._ownedHandles.delete(owner);
  }

  private _getOwnedHandles<DATA>(info: IQueueJobContext<DATA>, queueKey: string) {
    const owner = getTestAsyncCompletion(this.app);
    // Global/default handles belong to the runner, even during an owned operation.
    if (!owner || info.options?.instanceName !== owner.instanceName) return;
    let handles = this._ownedHandles.get(owner);
    let entry = handles?.get(queueKey);
    if (
      (this._workers[queueKey] && this._workers[queueKey] !== entry?.worker) ||
      (this._queues[queueKey] && this._queues[queueKey] !== entry?.queue) ||
      (entry && entry.prefix !== this._getPrefix())
    ) {
      throw new Error(`Cannot share preexisting owned-instance queue handles: ${queueKey}`);
    }
    if (!handles) {
      handles = new Map();
      this._ownedHandles.set(owner, handles);
    }
    if (!entry) {
      entry = { prefix: this._getPrefix() };
      handles.set(queueKey, entry);
    }
    return entry;
  }

  private _ownedJobKey(prefix: string, queueKey: string, jobId: string) {
    return `${prefix}||${queueKey}||${jobId}`;
  }

  private _completeOwnedJob(prefix: string, queueKey: string, jobId: string, error?: Error) {
    const key = this._ownedJobKey(prefix, queueKey, jobId);
    const job = this._ownedJobs.get(key);
    if (!job) return;
    job.terminal = { error };
    if (job.executions) return;
    this._ownedJobs.delete(key);
    job.ticket.complete(error);
  }

  _getPrefix() {
    return `${getRedisClientKeyPrefix('bull', this.app)}queue`;
  }

  _createWorker<DATA>(info: IQueueJobContext<DATA>, queueKey: string) {
    const app = this.app;
    // worker
    const _worker = {} as IQueueWork;
    // prefix
    const prefix = this._getPrefix();
    // queue config
    const queueConfig = app.bean.onion.queue.getOnionOptions(info.queueName);
    // queueConfig.options: queue/worker/job/redlock
    const workerOptions = queueConfig?.options?.worker;
    const redlockOptions = queueConfig?.options?.redlock;
    const _lockTTL = redlockOptions?.lockTTL ?? this.$scope.redlock.config.lockTTL;

    // redlock
    if (!queueConfig?.concurrency) {
      _worker.redlock = this.$scope.redlock.service.redlock.create(redlockOptions);
    }

    // create work
    const connectionWorker = app.bean.redis.get('queue');
    const _workerOptions = Object.assign({}, this.scope.config.worker, workerOptions, {
      prefix,
      connection: connectionWorker,
    });
    _worker.workerOptions = _workerOptions;
    _worker.worker = withoutTestAsyncCompletion(
      () =>
        new Bull.Worker(
          queueKey,
          async job => {
            // concurrency
            if (queueConfig?.concurrency) {
              return await this._performTask(job);
            }
            // redlock
            const info = job.data as IQueueJobContext<DATA>;
            const queueNameSub = info.options?.queueNameSub;
            const _lockResource = `queue:${queueKey}${queueNameSub ? `#${queueNameSub}` : ''}`;
            return await this.$scope.redlock.service.redlock.lock(
              _lockResource,
              async () => {
                return await this._performTask(job);
              },
              {
                // instanceName: job.data.instanceName, // need not
                redlock: _worker.redlock,
                lockTTL: _lockTTL,
              },
            );
          },
          _workerOptions,
        ),
    );

    _worker.worker.on('failed', (_job, err) => {
      this.app.handleError(err);
    });

    _worker.worker.on('error', err => {
      if (err.message && err.message.includes('Missing lock for job')) {
        const workerInner = _worker.worker as any;
        if (!workerInner.running) {
          _worker.worker.run().catch(err => {
            this.app.handleError(err);
          });
        }
      }
    });

    // ok
    return _worker;
  }

  _createQueue<DATA>(info: IQueueJobContext<DATA>, queueKey: string) {
    const app = this.app;
    // queue
    const _queue = {} as IQueueQueue;
    // prefix
    const prefix = this._getPrefix();
    // queue config
    const queueConfig = app.bean.onion.queue.getOnionOptions(info.queueName);
    // queueConfig.options: queue/worker/job/limiter
    const queueOptions = queueConfig?.options?.queue;

    // create queue
    const connectionQueue = app.bean.redis.get('queue');
    const _queueOptions = Object.assign({}, queueOptions, { prefix, connection: connectionQueue });
    _queue.config = queueConfig;
    _queue.options = _queueOptions;
    _queue.queue = new Bull.Queue(queueKey, _queueOptions);

    // create events
    const connectionEvents = app.bean.redis.get('queue');
    const _queueEventsOptions = { prefix, connection: connectionEvents } as Bull.QueueEventsOptions;
    _queue.queueEventsOptions = _queueEventsOptions;
    _queue.queueEvents = withoutTestAsyncCompletion(
      () => new Bull.QueueEvents(queueKey, _queueEventsOptions),
    );
    _queue.queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this._completeOwnedJob(prefix, queueKey, jobId);
      this._callCallback(jobId, undefined, returnvalue);
    });
    // QueueEvents reports terminal failure; Worker 'failed' also fires before retries.
    _queue.queueEvents.on('failed', ({ jobId, failedReason }) => {
      this._completeOwnedJob(prefix, queueKey, jobId, new Error(failedReason));
      this._callCallback(jobId, failedReason, undefined);
    });

    // ok
    return _queue;
  }

  _ensureWorker<DATA>(info: IQueueJobContext<DATA>) {
    // queueKey
    const queueKey = this._combineQueueKey(info);
    const ownedHandles = this._getOwnedHandles(info, queueKey);
    // worker
    if (!this._workers[queueKey]) {
      this._workers[queueKey] = this._createWorker(info, queueKey);
      if (ownedHandles) ownedHandles.worker = this._workers[queueKey];
    }
  }

  _ensureQueue<DATA>(info: IQueueJobContext<DATA>) {
    // worker
    this._ensureWorker(info);
    // queueKey
    const queueKey = this._combineQueueKey(info);
    const ownedHandles = this._getOwnedHandles(info, queueKey);
    // queue
    if (!this._queues[queueKey]) {
      this._queues[queueKey] = this._createQueue(info, queueKey);
      if (ownedHandles) ownedHandles.queue = this._queues[queueKey];
    }
    // ok
    return this._queues[queueKey];
  }

  getQueue(queueName: keyof IQueueRecord, instanceName?: keyof IInstanceRecord | undefined | null) {
    return this._getQueue({
      queueName,
      data: undefined as any,
      options: {
        instanceName: instanceName ?? this.ctx.instanceName,
      },
    });
  }

  _getQueue<DATA>(info: IQueueJobContext<DATA>) {
    return this._ensureQueue(info).queue;
  }

  _callCallback<DATA>(
    jobId: string | number,
    failedReason: string | undefined,
    data: DATA | undefined,
  ) {
    const _callback = this._queueCallbacks[jobId];
    if (_callback) {
      delete this._queueCallbacks[jobId];
      _callback.callback(failedReason ? new Error(failedReason) : undefined, data);
    }
  }

  async _queuePush<DATA, RESULT>(info: IQueueJobContext<DATA>, isAsync: boolean): Promise<RESULT> {
    const owner = isAsync ? getTestAsyncCompletion(this.app) : undefined;
    let ticket: TestAsyncCompletionTicket | undefined;
    let ownedJob: IOwnedQueueJob | undefined;
    let addAttempted = false;
    let callbackJobId: string | undefined;
    const telemetry = this.$scope.telemetry.service.telemetry;
    const span = telemetry.enabled
      ? telemetry.startSpan(`queue send ${String(info.queueName)}`, {
          kind: 3,
          attributes: {
            'messaging.operation.name': 'send',
            'messaging.destination.name': String(info.queueName),
          },
        })
      : undefined;
    if (span) {
      info = {
        ...info,
        options: {
          ...info.options,
          telemetry: telemetry.injectCarrier(telemetry.createContext(span)),
        },
      };
    }
    let callback: Promise<RESULT> | undefined;
    try {
      ticket = owner?.reserve(`queue ${String(info.queueName)}`);
      if (owner) {
        owner.assertScope(info.options);
        if (info.queueName !== 'a-orm:doubleDelete') {
          throw new Error(`Unsupported owned queue: ${String(info.queueName)}`);
        }
        this._assertOwnedDatasource(info, owner);
      }
      // queue config
      const queueConfig = this.bean.onion.queue.getOnionOptions(info.queueName);
      // queueConfig.options: queue/worker/job/limiter
      const jobOptionsBase = queueConfig?.options?.job;
      // job
      const jobId = owner ? uuidv4() : info.options?.jobOptions?.jobId || uuidv4();
      const jobName = info.options?.jobName || jobId;
      const jobOptions = deepExtend({ jobId }, jobOptionsBase, info.options?.jobOptions);
      if (owner) {
        if (
          jobOptions.jobId !== jobId ||
          jobOptions.repeat ||
          jobOptions.deduplication ||
          jobOptions.debounce
        ) {
          throw new Error('Owned queue jobs require a local UUID without repeat or deduplication');
        }
        const prefix = this._getPrefix();
        const queueKey = this._combineQueueKey(info);
        ownedJob = { owner, ticket: ticket!, prefix, queueKey, jobId, executions: 0 };
        this._ownedJobs.set(this._ownedJobKey(prefix, queueKey, jobId), ownedJob);
      }
      // Register ownership before creating handles or awaiting QueueEvents readiness.
      const queueQueue = this._ensureQueue(info);
      const queue = queueQueue.queue;
      // should not change info, hold original info.options?.jobName, info.options?.jobOptions
      // info = deepExtend({}, info, { options: { jobName, jobOptions } });
      if (!isAsync) {
        await queue.add(jobName, info, jobOptions);
        return undefined as any;
      }
      await this._queueEventsReady(queueQueue);
      callbackJobId = jobId;
      callback = new Promise((resolve, reject) => {
        this._queueCallbacks[jobId] = {
          info,
          callback: (err, data) => {
            if (err) return reject(err);
            resolve(data as unknown as RESULT);
          },
        };
      });
      // Observe terminal rejection even if queue.add rejects before we can await callback.
      if (owner) void callback.catch(() => {});
      addAttempted = true;
      await queue.add(jobName, info, jobOptions);
    } catch (err) {
      if (owner && ticket) {
        if (addAttempted) {
          // A transport error cannot prove the job was not enqueued. Keep ownership
          // pending until its actual terminal event, but retain the send failure.
          void owner
            .track(`queue add ${ownedJob?.jobId}`, async () => {
              throw err;
            })
            .catch(() => {});
        } else {
          if (ownedJob) {
            this._ownedJobs.delete(
              this._ownedJobKey(ownedJob.prefix, ownedJob.queueKey, ownedJob.jobId),
            );
          }
          if (callbackJobId) delete this._queueCallbacks[callbackJobId];
          ticket.complete(err);
        }
      }
      if (span) telemetry.recordException(span, err);
      throw err;
    } finally {
      span?.end();
    }
    return await callback!;
  }

  async _queueEventsReady(queueQueue: IQueueQueue) {
    if (queueQueue.queueEventsReady) return;
    await queueQueue.queueEvents.waitUntilReady();
    queueQueue.queueEventsReady = true;
  }

  _combineQueueKey<DATA>(info: IQueueJobContext<DATA>) {
    const instanceName = instanceDesp(info.options?.instanceName);
    return `${instanceName}||${beanFullNameFromOnionName(info.queueName, 'queue')}`;
  }

  async _performTask<DATA, RESULT>(job: TypeQueueJob<DATA, RESULT>) {
    const ownedJob = job.id
      ? this._ownedJobs.get(this._ownedJobKey(job.prefix, job.queueName, job.id))
      : undefined;
    if (!ownedJob) return await withoutTestAsyncCompletion(() => this._performTaskInner(job));
    ownedJob.executions++;
    try {
      return await ownedJob.owner.bind(async () => {
        ownedJob.owner.assertScope(job.data.options);
        if (this._combineQueueKey(job.data) !== ownedJob.queueKey) {
          throw new Error('Owned queue execution key does not match its registered scope');
        }
        this._assertOwnedDatasource(job.data, ownedJob.owner);
        return await this._performTaskInner(job);
      });
    } finally {
      ownedJob.executions--;
      if (ownedJob.terminal) {
        this._completeOwnedJob(
          ownedJob.prefix,
          ownedJob.queueKey,
          ownedJob.jobId,
          ownedJob.terminal.error,
        );
      }
    }
  }

  private _assertOwnedDatasource<DATA>(info: IQueueJobContext<DATA>, owner: TestAsyncCompletion) {
    // This supported queue executes against data.clientName, not just newCtx's dbInfo.
    if (
      info.queueName !== 'a-orm:doubleDelete' ||
      (info.data as { clientName?: string })?.clientName !== owner.clientName
    ) {
      throw new Error('Owned queue datasource does not match its completion owner');
    }
  }

  private async _performTaskInner<DATA, RESULT>(job: TypeQueueJob<DATA, RESULT>) {
    const info = job.data;
    const telemetry = this.$scope.telemetry.service.telemetry;
    const parent = telemetry.extractCarrier(info.options?.telemetry);
    const span = telemetry.enabled
      ? telemetry.startSpan(
          `queue process ${String(info.queueName)}`,
          {
            kind: 4,
            attributes: {
              'messaging.operation.name': 'process',
              'messaging.destination.name': String(info.queueName),
              'messaging.message.retry.count': job.attemptsMade,
            },
          },
          parent,
        )
      : undefined;
    // queue config
    const queueItem = this.bean.onion.queue.getOnionSlice(info.queueName);
    const queueConfig = this.bean.onion.queue.getOnionOptions(info.queueName);
    const execute = () =>
      this.bean.executor.newCtx(
        async () => {
          const beanFullName = queueItem.beanOptions.beanFullName;
          const beanInstance = <IQueueExecute<DATA>>this.app.bean._getBean(beanFullName as any);
          return await beanInstance.execute(info.data, info.options, job);
        },
        {
          dbInfo: info.options?.dbInfo,
          locale: info.options?.locale,
          tz: info.options?.tz,
          instanceName: info.options?.instanceName,
          extraData: {
            ...info.options?.extraData,
            state: {
              ...info.options?.extraData?.state,
              telemetry: span
                ? { context: telemetry.createContext(span, parent), span }
                : undefined,
            },
          },
          transaction: queueConfig?.transaction,
        },
      );
    try {
      return await (span ? telemetry.withSpan(span, execute) : execute());
    } catch (err) {
      if (span) telemetry.recordException(span, err);
      throw err;
    } finally {
      span?.end();
    }
  }

  getRepeatKey(jobName: string, repeat: Bull.RepeatOptions) {
    const endDate = repeat.endDate ? new Date(repeat.endDate).getTime() : '';
    const tz = repeat.tz || '';
    const pattern = repeat.pattern;
    const suffix = pattern || String(repeat.every) || '';
    return `${jobName}:${endDate}:${tz}:${suffix}`;
  }

  prepareJobInfo<DATA>(
    queueName: keyof IQueueRecord,
    data: DATA,
    options?: IQueuePushOptions,
  ): IQueueJobContext<DATA> {
    options = this.$scope.executor.service.executor.prepareGeneralInfo(options);
    // info
    return { queueName, data, options };
  }
}
