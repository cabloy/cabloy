const Base = require('sdk-base');
const async = require('async');
const uuid = require('uuid');
const util = require('../util.js');
const eventQueueApp = 'eb:event:queueApp';

module.exports = function(app) {

  class Queue extends Base {
    constructor(options) {
      super({
        initMethod: 'init',
      });
      this._options = options;
      this._queues = {};
      this._app = null;
      app.meta.__innerCookie = uuid.v4();
    }

    async init() {
      await this.ready(true);
      if (app.meta.inAgent && app.meta.isTest) {
        app.messenger.once(eventQueueApp, data => {
          this._app = data.app;
        });
      }
    }

    subscribe({ subdomain, module, queueName, key }, listener) {
      this.on(this._combileFullKey({ subdomain, module, queueName, key }), listener);
    }

    unSubscribe({ subdomain, module, queueName, key }) {
      this.off(this._combileFullKey({ subdomain, module, queueName, key }));
    }

    publish({ subdomain, module, queueName, key, data }) {
      const queueKey = this._combileQueueKey({ subdomain, module, queueName });
      const fullKey = this._combileFullKey({ subdomain, module, queueName, key });
      // innerCookie
      if (fullKey === ':::innerCookie') {
        this.emit(fullKey, {
          innerCookie: app.meta.__innerCookie,
        });
        return;
      }

      // queue
      let queue = this._queues[queueKey];
      if (!queue) {
        queue = this._queues[queueKey] = async.queue(({ subdomain, module, queueName, key, data }, cb) => {
          this._performTask({ subdomain, module, queueName, key, data }, cb);
        }, 1);
      }
      // push
      queue.push({ subdomain, module, queueName, key, data });
    }

    _combileQueueKey({ subdomain = '', module = '', queueName = '' }) {
      return `${subdomain}:${module}:${queueName}`;
    }

    _combileFullKey({ subdomain, module, queueName, key = '' }) {
      const queueKey = this._combileQueueKey({ subdomain, module, queueName });
      return `${queueKey}:${key}`;
    }

    _callback(key, fullKey, res, cb) {
      // emit result
      if (key) this.emit(fullKey, res);
      // callback
      cb();
    }

    _performTask({ subdomain, module, queueName, key, data }, cb) {
      const fullKey = this._combileFullKey({ subdomain, module, queueName, key });
      // queue config
      const queueConfig = app.meta.queues[`${module}:${queueName}`];
      // task
      let task;
      if (app.meta.isTest) {
        const url = util.combineApiPath(module, queueConfig.config.path);
        const ctx = this._app.createAnonymousContext({
          method: 'post',
          url,
        });
        task = ctx.performAction({
          method: 'post',
          url,
          headers: {
            'x-inner-subdomain': subdomain,
          },
          body: data,
        });
      } else {
        const url = util.combineFetchPath(module, queueConfig.config.path);
        const listen = app.config.cluster.listen;
        task = app.curl(`http://${listen.hostname}:${listen.port}${url}`, {
          method: 'POST',
          contentType: 'json',
          dataType: 'json',
          headers: {
            'x-inner-cookie': app.meta.__innerCookie,
            'x-inner-subdomain': subdomain,
          },
          data,
        });
      }
      // perform
      task.then(result => {
        let res;
        if (app.meta.isTest) {
          res = { data: result };
        } else {
          if (result.data && result.data.code === 0) {
            res = { data: result.data.data };
          } else {
            res = { err: result.data };
          }
        }
        this._callback(key, fullKey, res, cb);
      }).catch(err => {
        const res = { err: { code: err.code, message: err.message } };
        this._callback(key, fullKey, res, cb);
      });
    }
  }

  // queue
  app.meta.queue = app.cluster(Queue).create({});

  // beforeStart
  app.beforeStart(async () => {
    // queue
    await app.meta.queue.ready();

    if (app.meta.inApp) {
      // get from agent: innerCookie
      const info = { subdomain: '', module: '', queueName: '', key: 'innerCookie' };
      app.meta.queue.subscribe(info, data => {
        app.meta.__innerCookie = data.innerCookie;
        app.meta.queue.unSubscribe(info);
      });
      app.meta.queue.publish(info);
      // send to agent: app
      if (app.meta.isTest) {
        app.messenger.sendToAgent(eventQueueApp, { app });
      }
    }
  });

};
