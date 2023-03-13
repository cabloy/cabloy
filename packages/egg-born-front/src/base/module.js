import mparse from 'egg-born-mparse';
import modulesRepo from '../../__runtime/modules.js';
import nprogressFn from './nprogress.js';

export default function (Vue) {
  const loadingQueue = {
    _queue: {},
    push(relativeName, cb) {
      if (!this._queue[relativeName]) this._queue[relativeName] = [];
      this._queue[relativeName].push(cb);
      return this._queue[relativeName].length === 1;
    },
    pop(relativeName, module, err) {
      if (!this._queue[relativeName]) return;
      for (const cb of this._queue[relativeName]) {
        cb(module, err);
      }
      delete this._queue[relativeName];
    },
  };

  const nprogress = nprogressFn(Vue);

  const module = {
    _get(relativeName) {
      return Vue.prototype.$meta.modules[relativeName || 'main'];
    },
    get(relativeName) {
      const module = this._get(relativeName);
      if (module) return module;
      // try sync module
      try {
        this._require(relativeName);
        return this._get(relativeName);
      } catch (err) {
        return null;
      }
    },
    set(relativeName, module) {
      Vue.prototype.$meta.modules[relativeName] = module;
      if (module.info.monkey) {
        Vue.prototype.$meta.modulesMonkey[relativeName] = module;
      }
    },
    // use
    //   relativeName / relativeName-sync
    use(moduleName, cb) {
      if (cb) {
        const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
        if (!moduleInfo) {
          const message = Vue.prototype.$text('InvalidModuleName');
          throw new Error(`${message}: ${moduleName}`);
        }
        const relativeName = moduleInfo.relativeName;
        const module = this._get(relativeName);
        if (module) return cb(module);
        const moduleRepo = modulesRepo.modules[relativeName];
        if (!moduleRepo) {
          const message = Vue.prototype.$text('ModuleNotExists');
          throw new Error(`${message}: ${relativeName}`);
        }
        if (loadingQueue.push(relativeName, cb)) {
          try {
            if (moduleRepo.info.sync) {
              this._require(relativeName, module => loadingQueue.pop(relativeName, module));
            } else {
              this._import(relativeName)
                .then(module => loadingQueue.pop(relativeName, module))
                .catch(err => {
                  loadingQueue.pop(relativeName, null, err);
                });
            }
          } catch (err) {
            loadingQueue.pop(relativeName, null, err);
          }
        }
      } else {
        return new Promise((resolve, reject) => {
          try {
            this.use(moduleName, (module, err) => {
              if (err) return reject(err);
              resolve(module);
            });
          } catch (err) {
            reject(err);
          }
        });
      }
    },
    async tryUse(moduleName) {
      try {
        const module = await this.use(moduleName);
        return module;
      } catch (err) {
        return null;
      }
    },
    loadWaitings() {
      for (const key in Vue.prototype.$meta.modulesWaiting) {
        this._registerRoutes(Vue.prototype.$meta.modulesWaiting[key]);
      }
    },
    monkeyModule(monkeyName, monkeyData) {
      for (const key in Vue.prototype.$meta.modulesMonkey) {
        const moduleMonkey = Vue.prototype.$meta.modulesMonkey[key];
        if (moduleMonkey.options.monkey && moduleMonkey.options.monkey[monkeyName]) {
          moduleMonkey.options.monkey[monkeyName](monkeyData);
        }
      }
    },
    install(instance, moduleInfo, cb) {
      // callback
      const callback = options => {
        // module
        const module = {
          name: moduleInfo.relativeName,
          info: moduleInfo,
          instance,
          options,
        };
        // set
        this.set(moduleInfo.relativeName, module);
        // monkey
        this.monkeyModule('moduleLoaded', { module });
        // routes
        if (!Vue.prototype.$f7) {
          Vue.prototype.$meta.modulesWaiting[moduleInfo.relativeName] = module;
        } else {
          this._registerRoutes(module);
        }
        // register resources
        this._registerResources(module);
        // invoke onLoaded
        if (module.options.onLoaded) {
          module.options.onLoaded();
        }
        // ready
        return cb && cb(module);
      };
      // install
      Vue.use(instance.default, callback, { moduleInfo });
    },
    async _import(relativeName) {
      return new Promise((resolve, reject) => {
        const moduleRepo = modulesRepo.modules[relativeName];
        if (!moduleRepo) {
          return reject(new Error(`Module ${relativeName} not exists`));
        }
        nprogress.start();
        moduleRepo
          .instance()
          .then(instance => {
            nprogress.done();
            if (!instance || !instance.default || !instance.default.install) {
              instance = window[relativeName];
            }
            this.install(instance, moduleRepo.info, module => {
              resolve(module);
            });
          })
          .catch(err => {
            nprogress.done();
            reject(err);
          });
      });
    },
    requireAllMonkeys() {
      for (const relativeName in modulesRepo.modulesMonkey) {
        const moduleRepo = modulesRepo.modules[relativeName];
        this._requireJS(moduleRepo);
      }
    },
    requireAllSyncs() {
      for (const relativeName in modulesRepo.modulesSync) {
        const moduleRepo = modulesRepo.modules[relativeName];
        this._requireJS(moduleRepo);
      }
    },
    _require(relativeName, cb) {
      const moduleRepo = modulesRepo.modules[relativeName];
      if (!moduleRepo) throw new Error(`Module ${relativeName} not exists`);
      this._requireJS(moduleRepo, cb);
    },
    _requireJS(moduleRepo, cb) {
      // instance
      let instance = moduleRepo.instance;
      if (!instance.default) {
        instance = window[moduleRepo.info.relativeName];
      }
      // install
      this.install(instance, moduleRepo.info, module => {
        // ok
        cb && cb(module);
      });
    },
    _registerRoutes(module) {
      if (!module.options.routes) return null;
      const routes = module.options.routes.map(route => {
        Vue.prototype.$meta.util._setComponentModule(route.component, route.module || module);
        // path
        route.path = `/${module.info.pid}/${module.info.name}/${route.path}`;
        // meta.modal
        if (route.meta && route.meta.modal) {
          route[route.meta.modal] = {
            component: route.component,
          };
          route.component = null;
        }
        // meta.auth
        if (route.meta && route.meta.auth) {
          route.async = function (routeTo, routeFrom, resolve, reject) {
            if (Vue.prototype.$meta.store.state.auth.loggedIn) {
              const _component = {};
              if (route.meta.modal) {
                _component[route.meta.modal] = route.async[route.meta.modal];
              } else {
                _component.component = route.async.component;
              }
              resolve(_component);
            } else {
              // login
              Vue.prototype.$meta.vueLayout.openLogin({
                view: this.view,
                url: routeTo,
              });
              reject();
            }
          };
          if (route.meta.modal) {
            route.async[route.meta.modal] = route[route.meta.modal];
            route[route.meta.modal] = null;
          } else {
            route.async.component = route.component;
            route.component = null;
          }
        }
        return route;
      });
      Vue.prototype.$f7.routes = Vue.prototype.$f7.routes.concat(routes);
    },
    _registerResources(module) {
      module.options.components && this._registerComponents(module);
      module.options.store && this._registerStore(module);
      module.options.config && this._registerConfig(module);
      module.options.locales && this._registerLocales(module);
    },
    _registerComponents(module) {
      for (const key in module.options.components) {
        const component = module.options.components[key];
        Vue.prototype.$meta.util._setComponentModule(component, component.module || module);
        Vue.prototype.$meta.util._setComponentGlobal(component);
      }
    },
    _registerStore(module) {
      if (!Vue.prototype.$meta.store._modulesNamespaceMap[`${module.info.pid}/`]) {
        Vue.prototype.$meta.store.registerModule(module.info.pid, {
          namespaced: true,
        });
      }
      module.options.store.namespaced = true;
      Vue.prototype.$meta.store.registerModule([module.info.pid, module.info.name], module.options.store);
    },
    _registerConfig(module) {
      if (module.name === 'main') {
        // scene
        module.options.config.scene = process.env.SCENE;
        // env
        module.options.config.env = process.env.NODE_ENV;
        // extend
        Vue.prototype.$utils.extend(Vue.prototype.$meta._configOriginal, module.options.config);
        // baseURL
        if (Vue.prototype.$meta.config.api.baseURL) {
          Vue.prototype.$meta.axios.defaults.baseURL = Vue.prototype.$meta.config.api.baseURL;
          Vue.prototype.$meta.axios.defaults.withCredentials = true;
        }
      } else {
        Vue.prototype.$meta._configOriginal.modules[module.info.relativeName] = Vue.prototype.$utils.extend(
          {},
          module.options.config,
          Vue.prototype.$meta._configOriginal.modules[module.info.relativeName]
        );
      }
    },
    _registerLocales(module) {
      Object.keys(module.options.locales).forEach(key => {
        Vue.prototype.$meta.locales[key] = Vue.prototype.$utils.extend(
          {},
          module.options.locales[key],
          Vue.prototype.$meta.locales[key]
        );
      });
    },
  };

  return module;
}
