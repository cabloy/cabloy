const util = require('../util.js');

module.exports = function(app) {

  class BroadcastClient {

    constructor() {
      this.init();
    }

    init() {
      if (app.meta.inApp) {
        app.meta.messenger.addProvider({
          name: 'broadcastCall',
          handler: async info => {
            const ctx = app.createAnonymousContext({
              method: 'post',
              url: info.url,
            });
            await ctx.performAction(info);
          },
        });
      } else {
        app.meta.messenger.addProvider({
          name: 'broadcastEmit',
          handler: info => {
            this._performTask(info);
          },
        });
      }
    }

    // { subdomain, module, broadcastName, data }
    emit(info) {
      app.meta.messenger.callAgent({ name: 'broadcastEmit', data: info });
    }

    _performTask({ locale, subdomain, module, broadcastName, data }) {
      // broadcast config
      const broadcastConfig = app.meta.broadcasts[`${module}:${broadcastName}`];
      // url
      let url = util.combineApiPath(module, broadcastConfig.config.path);
      // queries
      const queries = {};
      if (locale) queries.locale = locale;
      url = util.combineQueries(url, queries);
      // call
      app.meta.messenger.callAll({
        name: 'broadcastCall',
        data: {
          subdomain,
          method: 'post',
          url,
          body: data,
        },
      });
    }
  }

  return BroadcastClient;
};

