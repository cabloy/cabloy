const require3 = require('require3');
const chokidar = require3('chokidar');
const debounce = require3('debounce');

module.exports = function(app) {

  class Watcher {

    constructor() {
      this._watchers = {};
      this._init();
    }

    _init() {
      if (app.meta.inApp) {
        // app
        app.meta.messenger.addProvider({
          name: 'a-cms:watcherChange',
          handler: async info => {
            await this._change(info);
          },
        });
      } else {
        // agent
        app.meta.messenger.addProvider({
          name: 'a-cms:watcherRegister',
          handler: info => {
            this._register(info);
          },
        });
      }
    }

    // called by app
    register(info) {
      app.meta.messenger.callAgent({ name: 'a-cms:watcherRegister', data: info });
    }

    // invoked in agent
    _register(info) {
      // key
      const keys = { subdomain: info.subdomain, atomClass: info.atomClass, language: info.language };
      const key = JSON.stringify(keys);
      // watcherEntry
      let watcherEntry = this._watchers[key];
      if (watcherEntry) {
        watcherEntry.watcher.close();
        watcherEntry.watcher = null;
      } else {
        watcherEntry = this._watchers[key] = { info };
      }
      // watcher
      watcherEntry.watcher = chokidar.watch(info.watchers)
        .on('change', debounce(function() {
          app.meta.messenger.callRandom({
            name: 'a-cms:watcherChange',
            data: keys,
          });
        }, 300));
    }

    // invoked in app
    async _change({ subdomain, atomClass, language }) {
      app.meta.queue.push({
        subdomain,
        module: atomClass.module,
        queueName: 'render',
        queueNameSub: `${atomClass.module}:${atomClass.atomClassName}`,
        data: {
          queueAction: 'buildLanguage',
          atomClass,
          language,
        },
      });
    }

  }

  return Watcher;
};
