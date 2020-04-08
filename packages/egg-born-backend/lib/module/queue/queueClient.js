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
      const queueConfig = app.meta.queues[`${info.module}:${info.queueName}`];
      // limiter
      const limiterOptions = {
        maxConcurrent: 1,
        minTime: null,
        reservoir: null,
        id: `${app.name}:bullmq:${queueKey}`,
        clearDatastore: false,
      };
      const limiter = app.meta.limiter.create(limiterOptions);
      // create queue
      const prefix = `bull_${app.name}`;
      const connection = app.redis.get('queue').duplicate();
      const _queue = new bull.Queue(queueKey, { prefix, connection });
      // create work
      const worker = new bull.Worker(queueKey, async job => {
        const jobOptions = {
          expiration: queueConfig.expiration || 1000 * 60,
        };
        return await limiter.schedule(jobOptions, () => this._performTask(job.data));
      }, { prefix: `bull_${app.name}`, connection });

      worker.on('completed', job => {
        this._callCallback(job.name, null, job.returnvalue);
      });

      worker.on('failed', (job, err) => {
        this._callCallback(job.name, err, null);
      });

      return _queue;
    }

    _callCallback(jobName, err, data) {
      const _callback = this._queueCallbacks[jobName];
      if (_callback) {
        _callback(err, data);
        delete this._queueCallbacks[jobName];
      }
    }

    _queuePush(info, isAsync) {
      // queueKey
      const queueKey = this._combineQueueKey(info);
      // queue
      if (!this._queues[queueKey]) {
        this._queues[queueKey] = this._createQueue(info, queueKey);
      }
      // add job
      const jobName = uuid.v4();
      this._queues[queueKey].add(jobName, info);

      // async
      if (!isAsync) return;
      return new Promise((resolve, reject) => {
        // callback
        this._queueCallbacks[jobName] = (err, data) => {
          if (err) return reject(err);
          resolve(data);
        };
      });
    }

    _combineQueueKey({ subdomain = '', module = '', queueName = '', queueNameSub = '' }) {
      let queueKey = `${subdomain}||${module}||${queueName}`;
      if (queueNameSub) {
        queueKey += `##${queueNameSub}`;
      }
      return queueKey;
    }

    async _performTask({ locale, subdomain, module, queueName, queueNameSub, data }) {
      // queue config
      const queueConfig = app.meta.queues[`${module}:${queueName}`];
      // url
      let url = util.combineApiPath(module, queueConfig.config.path);
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

