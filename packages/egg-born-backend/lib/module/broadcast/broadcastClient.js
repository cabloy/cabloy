const util = require('../util.js');

module.exports = function(app) {

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
      this.sub.subscribe(this.channelName, function() {});
      this.sub.on('message', (channel, info) => {
        this._performTask(JSON.parse(info)).then(() => {
          // do nothing
        });
      });
    }

    // { subdomain, module, broadcastName, data }
    emit(info) {
      info.__callerId = this.__callerId;
      this.pub.publish(this.channelName, JSON.stringify(info));
    }

    async _performTask({ __callerId, locale, subdomain, module, broadcastName, data }) {
      // data
      data = data || {};
      if (__callerId === this.__callerId) {
        data.sameAsCaller = true;
      }
      // broadcast config
      const broadcastConfig = app.meta.broadcasts[`${module}:${broadcastName}`];
      // url
      let url = util.combineApiPath(module, broadcastConfig.config.path);
      // queries
      const queries = {};
      if (locale) queries.locale = locale;
      url = util.combineQueries(url, queries);
      // perform
      const ctx = app.createAnonymousContext({
        method: 'post',
        url,
      });
      await ctx.performAction({
        subdomain,
        method: 'post',
        url,
        body: data,
      });
    }
  }

  return BroadcastClient;
};

