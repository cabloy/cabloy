const bull = require('bullmq');
const uuid = require('uuid');
const util = require('../util.js');

module.exports = function(app) {

  class QueueClient {

    constructor() {
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

    _createQueue(info, queueKey) {
      // queue config
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`].config;
      // queueConfig.options: queue/worker/job/limiter
      const queueOptions = (queueConfig.options && queueConfig.options.queue) || null;
      const workerOptions = (queueConfig.options && queueConfig.options.worker) || null;
      // const jobOptions = (queueConfig.options && queueConfig.options.job) || null;
      const limiterOptions = (queueConfig.options && queueConfig.options.limiter) || null;
      // limiter
      const bottleneckOptions = {
        maxConcurrent: 1,
        minTime: null,
        reservoir: null,
        id: `${app.name}:bullmq:${queueKey}`,
        clearDatastore: !!app.meta.isTest,
      };
      const limiterBottleneck = app.meta.limiter.create(bottleneckOptions);
      // create queue
      const prefix = `bull_${app.name}`;
      if (queueConfig.repeat) {
        const connectionScheduler = app.redis.get('queue').duplicate();
        // eslint-disable-next-line
        const _queueScheduler = new bull.QueueScheduler(queueKey, { prefix, connection: connectionScheduler });
      }
      const connectionQueue = app.redis.get('queue').duplicate();
      const _queueOptions = Object.assign({}, queueOptions, { prefix, connection: connectionQueue });
      const _queue = new bull.Queue(queueKey, _queueOptions);
      // create work
      const connectionWorker = app.redis.get('queue').duplicate();
      const _workerOptions = Object.assign({}, workerOptions, { prefix, connection: connectionWorker });
      const _worker = new bull.Worker(queueKey, async job => {
        // bull limiter
        if (_queueOptions.limiter) {
          return await this._performTask(job.data);
        }
        // bottleneck limiter
        const _limiterOptions = Object.assign({}, { expiration: app.config.queue.bottleneck.expiration }, limiterOptions);
        return await limiterBottleneck.schedule(_limiterOptions, () => {
          return this._performTask(job.data);
        });
      }, _workerOptions);
      _worker.on('failed', (job, err) => {
        app.logger.error(err);
      });
      // create events
      const connectionEvents = app.redis.get('queue').duplicate();
      const queueEvents = new bull.QueueEvents(queueKey, { prefix, connection: connectionEvents });
      queueEvents.on('completed', ({ jobId, returnvalue }) => {
        this._callCallback(jobId, null, returnvalue);
      });
      queueEvents.on('failed', ({ jobId, failedReason }) => {
        this._callCallback(jobId, failedReason, null);
      });
      // ok
      return _queue;
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
      // queueKey
      const queueKey = this._combineQueueKey(info);
      // queue
      if (!this._queues[queueKey]) {
        this._queues[queueKey] = this._createQueue(info, queueKey);
      }
      // job
      const jobId = uuid.v4();
      const jobName = info.jobName || jobId;
      const _jobOptions = Object.assign({}, jobOptions, info.jobOptions, { jobId });
      // not async
      if (!isAsync) {
        // add job
        return this._queues[queueKey].add(jobName, info, _jobOptions);
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
        return this._queues[queueKey].add(jobName, info, _jobOptions);
      });
    }

    _combineQueueKey({ subdomain = undefined, module = '', queueName = '', queueNameSub = '' }) {
      let queueKey = `${subdomain || '~'}||${module}||${queueName}`;
      if (queueNameSub) {
        queueKey += `##${queueNameSub}`;
      }
      return queueKey;
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

