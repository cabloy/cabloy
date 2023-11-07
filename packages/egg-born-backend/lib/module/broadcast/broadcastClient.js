module.exports = function (app) {
  class BroadcastClient {
    constructor() {
      this.__callerId = app.meta.workerId;
      this.channelName = null;
      this.sub = null;
      this.pub = null;
      this.init();
    }

    init() {
      this.channelName = `broadcast_${app.name}:`;
      this.pub = app.redis.get('broadcast').duplicate();
      this.sub = app.redis.get('broadcast').duplicate();
      this.sub.subscribe(this.channelName, function () {});
      this.sub.on('message', (channel, info) => {
        this._performTasks(JSON.parse(info))
          .then(() => {
            // do nothing
          })
          .catch(err => {
            app.logger.error(err);
          });
      });
    }

    // { locale, subdomain, module, broadcastName, data }
    emit(info) {
      info.__callerId = this.__callerId;
      this.pub.publish(this.channelName, JSON.stringify(info));
    }

    async _performTasks({ __callerId, locale, subdomain, module, broadcastName, data }) {
      // context
      const context = { data };
      if (__callerId === this.__callerId) {
        context.sameAsCaller = true;
      }
      // broadcasts
      const broadcastArray = app.meta.broadcasts[`${module}:${broadcastName}`];
      if (!broadcastArray) return;
      // loop
      for (const broadcast of broadcastArray) {
        await this._performTask({ broadcast, context, locale, subdomain });
      }
    }

    async _performTask({ broadcast, context, locale, subdomain }) {
      const bean = broadcast.bean;
      // execute as global when broadcast.config.instance === false
      // ignore when instance not started
      const instanceStarted = app.meta.util.instanceStarted(subdomain);
      if (!instanceStarted && broadcast.config.instance !== false) return;
      // execute
      return await app.meta.util.executeBean({
        locale,
        subdomain,
        context,
        beanModule: bean.module,
        beanFullName: `${bean.module}.broadcast.${bean.name}`,
        transaction: broadcast.config.transaction,
      });
    }
  }

  return BroadcastClient;
};
