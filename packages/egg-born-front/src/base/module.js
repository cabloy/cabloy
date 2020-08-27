import mparse from 'egg-born-mparse';
import modulesRepo from '../../build/__runtime/modules.js';

const rLocalJSs = require.context('../../../../src/module/', true, /-sync\/front\/src\/main\.js$/);
const rGlobalJSs = require.context('../../build/__runtime/modules/', true, /-sync\/dist\/front\.js$/);

export default function(Vue) {
  const loadingQueue = {
    _queue: {},
    push(relativeName, cb) {
      if (!this._queue[relativeName]) this._queue[relativeName] = [];
      this._queue[relativeName].push(cb);
      return this._queue[relativeName].length === 1;
    },
    pop(relativeName, module) {
      if (!this._queue[relativeName]) return;
      for (const cb of this._queue[relativeName]) {
        cb(module);
      }
      delete this._queue[relativeName];
    },
  };

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
        if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
        const relativeName = moduleInfo.relativeName;
        const module = this._get(relativeName);
        if (module) return cb(module);
        const moduleRepo = modulesRepo.modules[relativeName];
        if (!moduleRepo) throw new Error(`Module ${relativeName} not exists`);
        if (loadingQueue.push(relativeName, cb)) {
          if (moduleRepo.info.sync) {
            this._require(relativeName, module => loadingQueue.pop(relativeName, module));
          } else {
            this._import(relativeName, module => loadingQueue.pop(relativeName, module));
          }
        }
      } else {
        return new Promise(resolve => {
          this.use(moduleName, module => {
            resolve(module);
          });
        });
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
      // install
      Vue.use(instance.default, options => {
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
        // ready
        return cb && cb(module);
      });
    },
    _import(relativeName, cb) {
      const moduleRepo = modulesRepo.modules[relativeName];
      if (!moduleRepo) throw new Error(`Module ${relativeName} not exists`);
      moduleRepo.instance().then(instance => {
        if (!instance || !instance.default || !instance.default.install) {
          instance = window[relativeName];
        }
        this.install(instance, moduleRepo.info, module => {
          cb(module);
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
          route.async = function(routeTo, routeFrom, resolve, reject) {
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
                url: routeTo });
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
      Vue.prototype.$meta.store.registerModule([ module.info.pid, module.info.name ], module.options.store);
    },
    _registerConfig(module) {
      if (module.name === 'main') {
        // scene
        module.options.config.scene = process.env.SCENE;
        // extend
        Vue.prototype.$utils.extend(Vue.prototype.$meta.config, module.options.config);
        // baseURL
        if (Vue.prototype.$meta.config.api.baseURL) {
          Vue.prototype.$meta.axios.defaults.baseURL = Vue.prototype.$meta.config.api.baseURL;
          Vue.prototype.$meta.axios.defaults.withCredentials = true;
        }
      } else {
        Vue.prototype.$meta.config.modules[module.info.relativeName] =
        Vue.prototype.$utils.extend({}, module.options.config, Vue.prototype.$meta.config.modules[module.info.relativeName]);
      }
    },
    _registerLocales(module) {
      Object.keys(module.options.locales).forEach(key => {
        Vue.prototype.$meta.locales[key] =
         Vue.prototype.$utils.extend({}, module.options.locales[key], Vue.prototype.$meta.locales[key]);
      });
    },
  };

  return module;
}
