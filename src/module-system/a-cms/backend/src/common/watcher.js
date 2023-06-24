const path = require('path');
const require3 = require('require3');
const chokidar = require3('chokidar');
const debounce = require3('debounce');
// const eggBornUtils = require3('egg-born-utils');

module.exports = function (app) {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Watcher {
    constructor() {
      this._watchers = {};
      this._freezeCounter = 0;
      this._needReload = false;
      this._reloadDebounce = debounce(() => {
        if (this._freezeCounter === 0 && this._needReload) {
          this._needReload = false;
          this._reloadByAgent();
        }
      }, 1000);
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
        app.meta.messenger.addProvider({
          name: 'a-cms:reload',
          handler: info => {
            this._reloadByApp(info);
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

    // called by app
    reload({ action }) {
      app.meta.messenger.callAgent({ name: 'a-cms:reload', data: { action } });
    }

    _getWatcherKey({ development, subdomain, atomClass }) {
      if (development) return 'development';
      return `${subdomain}&&${atomClass.module}&&${atomClass.atomClassName}`;
    }

    _getWatcherAtomClass({ development, subdomain, atomClass }) {
      const watcherKey = this._getWatcherKey({ development, subdomain, atomClass });
      if (!this._watchers[watcherKey]) {
        this._watchers[watcherKey] = {};
      }
      return this._watchers[watcherKey];
    }

    _getWatcherAtomClassLanguage({ development, subdomain, atomClass, language }) {
      const watchers = this._getWatcherAtomClass({ development, subdomain, atomClass });
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
    _register({ development, subdomain, atomClass, language, watchers }) {
      // watchers
      if (development) {
        watchers = this._collectDevelopmentWatchDirs();
      }
      // watcherEntry
      const watcherEntry = this._getWatcherAtomClassLanguage({ development, subdomain, atomClass, language });
      watcherEntry.info = { development, subdomain, atomClass, language, watchers };
      // close
      if (watcherEntry.watcher) {
        const _watcher = watcherEntry.watcher;
        if (!_watcher.__eb_closed) {
          if (_watcher.__eb_ready) {
            _watcher.close();
          } else {
            _watcher.__eb_closing = true;
          }
        }
        watcherEntry.watcher = null;
      }
      // watcher
      const _watcher = chokidar.watch(watchers).on(
        'change',
        debounce(info => {
          if (development) {
            this._developmentChange(info);
          } else {
            app.meta.messenger.callRandom({
              name: 'a-cms:watcherChange',
              data: { subdomain, atomClass, language },
            });
          }
        }, 300)
      );
      // on ready
      _watcher.once('ready', function () {
        _watcher.__eb_ready = true;
        if (_watcher.__eb_closing) {
          _watcher.close();
          _watcher.__eb_closed = true;
        }
      });
      // ok
      watcherEntry.watcher = _watcher;
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

    // invoked in agent
    _collectDevelopmentWatchDirs() {
      const __pathes = ['backend/config', 'module', 'module-system', 'module-vendor', 'suite', 'suite-vendor'];
      const pathSrc = path.resolve(app.config.baseDir, '..');
      const watchDirs = [];
      for (const __path of __pathes) {
        watchDirs.push(path.join(pathSrc, __path));
      }
      return watchDirs;
      // const pathSrc = path.resolve(app.config.baseDir, '..');
      // let watchDirs = eggBornUtils.tools.globbySync(`${pathSrc}/**/backend/src`, { onlyDirectories: true });
      // watchDirs = [path.join(pathSrc, 'backend/config')].concat(watchDirs);
      // return watchDirs;
    }

    // invoked in agent
    _developmentChange(info) {
      info = info.replace(/\\/g, '/');
      if (info.indexOf('/backend/src/') > -1 || info.indexOf('/src/backend/config/') > -1) {
        app.logger.warn(`[agent:development] reload worker because ${info} changed`);
        this._reloadByApp({ action: 'now' });
      }
    }

    // invoked in agent
    _reloadByAgent() {
      process.send({
        to: 'master',
        action: 'reload-worker',
      });
    }

    //  invoked in agent
    _reloadByApp({ action }) {
      if (action === 'now') {
        if (this._freezeCounter > 0) {
          this._needReload = true;
        } else {
          this._reloadByAgent();
        }
      } else if (action === 'freeze') {
        this._freezeCounter++;
      } else if (action === 'unfreeze') {
        this._freezeCounter--;
        if (this._freezeCounter === 0 && this._needReload) {
          this._reloadDebounce();
        }
      }
    }
  }

  return Watcher;
};
