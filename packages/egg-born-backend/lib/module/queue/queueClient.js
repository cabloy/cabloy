const bull = require('bullmq');
const uuid = require('uuid');
const util = require('../util.js');

module.exports = function(app) {

  class QueueClient {

    constructor() {
      this._scheduler = {};
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
      const prefix = `bull_${app.name}:queue`;
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: queue/worker/job/redlock
      const workerOptions = (queueConfig.options && queueConfig.options.worker) || null;
      const redlockOptions = (queueConfig.options && queueConfig.options.redlock) || null;
      const _redlockOptions = Object.assign({}, app.config.queue.redlock.options, redlockOptions);

      // redlock
      if (!queueConfig.concurrency) {
        _worker.redlock = app.meta.redlock.create(_redlockOptions);
      }

      // create work
      const connectionWorker = app.redis.get('queue').duplicate();
      const _workerOptions = Object.assign({}, app.config.queue.worker, workerOptions, { prefix, connection: connectionWorker });
      _worker.worker = new bull.Worker(queueKey, async job => {
        // concurrency
        if (queueConfig.concurrency) {
          return await this._performTask(job.data);
        }
        // redlock
        const _lockResource = `redlock_${app.name}:queue:${queueKey}`;
        let _lock = await _worker.redlock.lock(_lockResource, _redlockOptions.lockTTL);
        try {
          job.data.redlock = {
            async extend(_ttl) {
              _lock = await _lock.extend(_ttl || _redlockOptions.lockTTL);
            },
          };
          const res = await this._performTask(job.data);
          job.data.redlock = null;
          await _lock.unlock();
          return res;
        } catch (err) {
          job.data.redlock = null;
          await _lock.unlock();
          throw err;
        }
      }, _workerOptions);

      _worker.worker.on('failed', (job, err) => {
        app.logger.error(err);
      });

      _worker.worker.on('error', err => {
        if (err.message && err.message.indexOf('Missing lock for job') > -1) {
          _worker.worker.run().catch(error => {
            console.error(error);
          });
        }
      });

      // ok
      return _worker;
    }

    _createQueue(info, queueKey) {
      // queue
      const _queue = {};
      // prefix
      const prefix = `bull_${app.name}:queue`;
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: scheduler/queue/worker/job/limiter
      const queueOptions = (queueConfig.options && queueConfig.options.queue) || null;

      // create queue
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

    _createScheduler(info, queueKey) {
      // prefix
      const prefix = `bull_${app.name}:queue`;
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: scheduler/queue/worker/job/limiter
      const schedulerOptions = (queueConfig.options && queueConfig.options.scheduler) || null;

      // create queue
      const connectionScheduler = app.redis.get('queue').duplicate();
      const _schedulerOptions = Object.assign({}, app.config.queue.scheduler, schedulerOptions, { prefix, connection: connectionScheduler });
      return new bull.QueueScheduler(queueKey, _schedulerOptions);
    }

    _ensureScheduler(info) {
      // queueKey
      const queueKey = this._combineQueueKey(info);
      // scheduler
      if (!this._scheduler[queueKey]) {
        this._scheduler[queueKey] = this._createScheduler(info, queueKey);
      }
    }

    _ensureWorker(info) {
      // scheduler
      this._ensureScheduler(info);
      // queueKey
      const queueKey = this._combineQueueKey(info);
      // worker
      if (!this._workers[queueKey]) {
        this._workers[queueKey] = this._createWorker(info, queueKey);
      }
    }

    _ensureQueue(info) {
      // worker
      this._ensureWorker(info);
      // queueKey
      const queueKey = this._combineQueueKey(info);
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

