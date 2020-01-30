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
            // pid
            if (info.pid === process.pid) {
              if (!info.body) info.body = {};
              info.body.sameAsCaller = true;
            }
            // perform
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
        app.meta.messenger.addProvider({
          name: 'reloadEmit',
          handler: () => {
            process.send({
              to: 'master',
              action: 'reload-worker',
            });
          },
        });
      }
    }

    // { subdomain, module, broadcastName, data }
    emit(info) {
      info.pid = process.pid;
      app.meta.messenger.callAgent({ name: 'broadcastEmit', data: info });
    }

    // this is a special feature
    reload() {
      app.meta.messenger.callAgent({ name: 'reloadEmit', data: null });
    }

    _performTask({ pid, locale, subdomain, module, broadcastName, data }) {
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
          pid,
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

