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
        app.meta.messenger.addProvider({
          name: 'a-cms:watcherRegisterLanguages',
          handler: info => {
            this._registerLanguages(info);
          },
        });
      }
    }

    // called by app
    register(info) {
      app.meta.messenger.callAgent({ name: 'a-cms:watcherRegister', data: info });
    }

    // called by app
    registerLanguages(info) {
      app.meta.messenger.callAgent({ name: 'a-cms:watcherRegisterLanguages', data: info });
    }

    // invoked in agent
    _registerLanguages({ info, watcherInfos }) {
      // key
      const atomClasskey = JSON.stringify(info.atomClass);
      // clear
      const _module = this._watchers.geto(info.subdomain).geto(info.atomClass.module);
      _module[atomClasskey] = null;
      // register
      for (const watcherInfo in watcherInfos) {
        this._register(watcherInfo);
      }
    }

    // invoked in agent
    _register({ subdomain, atomClass, language, watchers }) {
      // key
      const atomClasskey = JSON.stringify(atomClass);
      // watcherEntry
      const watcherEntry = this._watchers
        .geto(subdomain).geto(atomClass.module).geto(atomClasskey)
        .geto(language);
      if (watcherEntry.watcher) {
        watcherEntry.watcher.close();
        watcherEntry.watcher = null;
      } else {
        watcherEntry.info = { subdomain, atomClass, language, watchers };
      }
      // watcher
      watcherEntry.watcher = chokidar.watch(watchers)
        .on('change', debounce(function() {
          app.meta.messenger.callRandom({
            name: 'a-cms:watcherChange',
            data: { subdomain, atomClass, language },
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
