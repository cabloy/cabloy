const require3 = require('require3');
const chokidar = require3('chokidar');
const debounce = require3('debounce');

module.exports = function(app) {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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

    _getWatcherKey({ subdomain, atomClass }) {
      return `${subdomain}&&${atomClass.module}&&${atomClass.atomClassName}`;
    }

    _getWatcherAtomClass({ subdomain, atomClass }) {
      const watcherKey = this._getWatcherKey({ subdomain, atomClass });
      if (!this._watchers[watcherKey]) {
        this._watchers[watcherKey] = {};
      }
      return this._watchers[watcherKey];
    }

    _getWatcherAtomClassLanguage({ subdomain, atomClass, language }) {
      const watchers = this._getWatcherAtomClass({ subdomain, atomClass });
      if (!watchers[language]) {
        watchers[language] = {};
      }
      return watchers[language];
    }

    // invoked in agent
    _registerLanguages({ info, watcherInfos }) {
      // clear
      const watchers = this._getWatcherAtomClass({ subdomain: info.subdomain, atomClass: info.atomClass });
      for (const language in watchers) {
        const watcherEntry = watchers[language];
        if (watcherEntry.watcher) {
          watcherEntry.watcher.close();
          watcherEntry.watcher = null;
        }
      }
      // register
      for (const watcherInfo of watcherInfos) {
        this._register(watcherInfo);
      }
    }

    // invoked in agent
    _register({ subdomain, atomClass, language, watchers }) {
      // watcherEntry
      const watcherEntry = this._getWatcherAtomClassLanguage({ subdomain, atomClass, language });
      watcherEntry.info = { subdomain, atomClass, language, watchers };
      // close
      if (watcherEntry.watcher) {
        watcherEntry.watcher.close();
        watcherEntry.watcher = null;
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
        module: moduleInfo.relativeName,
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
