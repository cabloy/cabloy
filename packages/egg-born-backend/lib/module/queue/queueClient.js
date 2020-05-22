const bull = require('bullmq');
const uuid = require('uuid');
const util = require('../util.js');

module.exports = function(app) {

  class QueueClient {

    constructor() {
      this._workers = {};
      this._queues = {};
      this._queueCallbacks = {};
    }

    push(info) {
      this._queuePush(info, false);
    }

    // { subdomain, module, queueName,queueNameSub,data }
    pushAsync(info) {
      return this._queuePush(info, true);
    }

    async _clearWorkers() {
      for (const queueKey in this._workers) {
        const _worker = this._workers[queueKey];
        await _worker.worker.close();
      }
      this._workers = {};
    }

    _createWorker(info, queueKey) {
      // worker
      const _worker = {};
      // prefix
      const prefix = `bull_${app.name}`;
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: queue/worker/job/limiter
      const workerOptions = (queueConfig.options && queueConfig.options.worker) || null;
      const limiterOptions = (queueConfig.options && queueConfig.options.limiter) || null;
      // limiter
      if (!queueConfig.concurrency) {
        const bottleneckOptions = {
          maxConcurrent: 1,
          minTime: null,
          reservoir: null,
          id: `${app.name}:bullmq:${queueKey}`,
          clearDatastore: !!app.meta.isTest,
        };
        _worker.limiterBottleneck = app.meta.limiter.create(bottleneckOptions);
      }

      // create work
      const connectionWorker = app.redis.get('queue').duplicate();
      const _workerOptions = Object.assign({}, app.config.queue.worker, workerOptions, { prefix, connection: connectionWorker });
      _worker.worker = new bull.Worker(queueKey, async job => {
        // concurrency
        if (queueConfig.concurrency) {
          return await this._performTask(job.data);
        }
        // bottleneck limiter
        const _limiterOptions = Object.assign({}, { expiration: app.config.queue.bottleneck.expiration }, limiterOptions);
        return await _worker.limiterBottleneck.schedule(_limiterOptions, () => {
          return this._performTask(job.data);
        });
      }, _workerOptions);
      _worker.worker.on('failed', (job, err) => {
        app.logger.error(err);
      });
      // ok
      return _worker;
    }

    _createQueue(info, queueKey) {
      // queue
      const _queue = {};
      // prefix
      const prefix = `bull_${app.name}`;
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: scheduler/queue/worker/job/limiter
      const schedulerOptions = (queueConfig.options && queueConfig.options.scheduler) || null;
      const queueOptions = (queueConfig.options && queueConfig.options.queue) || null;

      // create queue
      const connectionScheduler = app.redis.get('queue').duplicate();
      const _schedulerOptions = Object.assign({}, app.config.queue.scheduler, schedulerOptions, { prefix, connection: connectionScheduler });
      _queue.queueScheduler = new bull.QueueScheduler(queueKey, _schedulerOptions);
      const connectionQueue = app.redis.get('queue').duplicate();
      const _queueOptions = Object.assign({}, queueOptions, { prefix, connection: connectionQueue });
      _queue.queue = new bull.Queue(queueKey, _queueOptions);

      // create events
      const connectionEvents = app.redis.get('queue').duplicate();
      _queue.queueEvents = new bull.QueueEvents(queueKey, { prefix, connection: connectionEvents });
      _queue.queueEvents.on('completed', ({ jobId, returnvalue }) => {
        this._callCallback(jobId, null, returnvalue);
      });
      _queue.queueEvents.on('failed', ({ jobId, failedReason }) => {
        this._callCallback(jobId, failedReason, null);
      });

      // ok
      return _queue;
    }

    _ensureWorker(info) {
      // queueKey
      const queueKey = this._combineQueueKey(info);
      // worker
      if (!this._workers[queueKey]) {
        this._workers[queueKey] = this._createWorker(info, queueKey);
      }
    }

    _ensureQueue(info) {
      // queueKey
      const queueKey = this._combineQueueKey(info);
      // worker
      if (!this._workers[queueKey]) {
        this._workers[queueKey] = this._createWorker(info, queueKey);
      }
      // queue
      if (!this._queues[queueKey]) {
        this._queues[queueKey] = this._createQueue(info, queueKey);
      }
      // ok
      return this._queues[queueKey];
    }

    _callCallback(jobId, failedReason, data) {
      const _callback = this._queueCallbacks[jobId];
      if (_callback) {
        _callback.callback(failedReason ? new Error(failedReason) : null, data);
        delete this._queueCallbacks[jobId];
      }
    }

    _queuePush(info, isAsync) {
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: queue/worker/job/limiter
      const jobOptions = (queueConfig.options && queueConfig.options.job) || null;
      // queue
      const queue = this._ensureQueue(info).queue;
      // job
      const jobId = uuid.v4();
      const jobName = info.jobName || jobId;
      const _jobOptions = Object.assign({}, jobOptions, info.jobOptions, { jobId });
      // not async
      if (!isAsync) {
        // add job
        return queue.add(jobName, info, _jobOptions);
      }
      // async
      return new Promise((resolve, reject) => {
        // callback
        this._queueCallbacks[jobId] = {
          info,
          callback: (err, data) => {
            if (err) return reject(err);
            resolve(data);
          },
        };
        // add job
        return queue.add(jobName, info, _jobOptions);
      });
    }

    _combineQueueKey({ module = '', queueName = '' }) {
      return `${module}||${queueName}`;
    }

    async _performTask({ locale, subdomain, module, queueName, queueNameSub, data }) {
      // queue config
      const queueConfig = app.meta.queues[`${module}:${queueName}`].config;
      // url
      let url = util.combineApiPath(module, queueConfig.path);
      // queries
      const queries = {};
      if (locale) queries.locale = locale;
      if (queueNameSub) queries.queueNameSub = queueNameSub;
      url = util.combineQueries(url, queries);
      // ctx
      const ctx = app.createAnonymousContext({
        method: 'post',
        url,
      });
      // performAction
      return await ctx.performAction({
        subdomain,
        method: 'post',
        url,
        body: data,
      });
    }
  }

  return QueueClient;
};

