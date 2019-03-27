const async = require('async');
const uuid = require('uuid');
const util = require('../util.js');

module.exports = function(app) {

  class QueueClient {

    constructor() {
      this._queues = {};
      this._queueCallbacks = {};
      this.init();
    }

    init() {
      if (app.meta.inApp) {
        app.meta.messenger.addProvider({
          name: 'queueCall',
          handler: async info => {
            const ctx = app.createAnonymousContext({
              method: 'post',
              url: info.url,
            });
            return await ctx.performAction(info);
          },
        });
        app.meta.messenger.addProvider({
          name: 'queuePushEcho',
          handler: res => {
            const key = res.key;
            this._queueCallbacks[key](res);
            delete this._queueCallbacks[key];
          },
        });
      } else {
        app.meta.messenger.addProvider({
          name: 'queuePush',
          handler: info => {
            const queueKey = this._combileQueueKey(info);
            // queue
            let queue = this._queues[queueKey];
            if (!queue) {
              queue = this._queues[queueKey] = async.queue((info, cb) => {
                this._performTask(info, cb);
              }, 1);
            }
            // push
            queue.push(info);
          },
        });
      }
    }

    push(info) {
      app.meta.messenger.callAgent({ name: 'queuePush', data: info });
    }

    // { subdomain, module, queueName,queueNameSub,data }
    pushAsync(info) {
      return new Promise((resolve, reject) => {
        info.key = uuid.v1();
        info.pid = process.pid;
        this._queueCallbacks[info.key] = res => {
          if (res.err) return reject(new Error(res.err.message));
          resolve(res.data);
        };
        app.meta.messenger.callAgent({ name: 'queuePush', data: info });
      });
    }

    _combileQueueKey({ subdomain = '', module = '', queueName = '', queueNameSub = '' }) {
      let queueKey = `${subdomain}||${module}||${queueName}`;
      if (queueNameSub) {
        queueKey += `##${queueNameSub}`;
      }
      return queueKey;
    }

    _performTask({ subdomain, module, queueName, queueNameSub, key, pid, data }, cb) {
      // queue config
      const queueConfig = app.meta.queues[`${module}:${queueName}`];
      // url
      let url = util.combineApiPath(module, queueConfig.config.path);
      if (queueNameSub) {
        url += `?queueNameSub=${encodeURIComponent(queueNameSub)}`;
      }
      // call
      app.meta.messenger.callRandom({
        name: 'queueCall',
        data: {
          method: 'post',
          url,
          headers: { 'x-inner-subdomain': subdomain },
          body: data,
        },
      }, res => {
        if (key) {
          res.key = key;
          app.meta.messenger.callTo(pid, {
            name: 'queuePushEcho',
            data: res,
          });
        }
        // callback
        cb();
      });
    }
  }

  return QueueClient;
};

