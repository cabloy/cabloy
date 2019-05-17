import mparse from 'egg-born-mparse';
const rLocalJSs = require.context('../../../../src/module/', true, /-sync\/front\/src\/main\.js$/);
const rGlobalJSs = require.context('../../build/__module/', true, /-sync\/dist\/front\.js$/);
const rCustomCSSs = require.context('../../../../src/front/assets/css/module/', true, /-sync\/custom\.less$/);

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
    _get(moduleRelativeName) {
      return Vue.prototype.$meta.modules[moduleRelativeName || 'main'];
    },
    get(moduleRelativeName) {
      const module = this._get(moduleRelativeName);
      if (module) return module;
      // try sync module
      try {
        const moduleInfo = mparse.parseInfo(moduleRelativeName);
        if (!moduleInfo) throw new Error('invalid module name!');
        this._require(moduleInfo);
        return this._get(moduleRelativeName);
      } catch (err) {
        return null;
      }
    },
    set(moduleRelativeName, module) {
      Vue.prototype.$meta.modules[moduleRelativeName] = module;
    },
    // use
    //   moduleRelativeName / moduleRelativeName-sync
    use(moduleName, cb) {
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      if (!moduleInfo) throw new Error('invalid module name!');
      const module = this._get(moduleInfo.relativeName);
      if (module) return cb(module);
      if (loadingQueue.push(moduleInfo.relativeName, cb)) {
        if (moduleInfo.sync) {
          this._require(moduleInfo, module => loadingQueue.pop(moduleInfo.relativeName, module));
        } else {
          this._import(moduleInfo, module => loadingQueue.pop(moduleInfo.relativeName, module));
        }
      }
    },
    loadWaitings() {
      for (const key in Vue.prototype.$meta.modulesWaiting) {
        this._registerRoutes(Vue.prototype.$meta.modulesWaiting[key]);
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
    _import(moduleInfo, cb) {
      this._import2(moduleInfo, instance => {
        // instance
        this.install(instance, moduleInfo, module => {
          // custom css
          import(`../../../../src/front/assets/css/module/${moduleInfo.relativeName}/custom.less`).then(() => {
            cb(module);
          }).catch(() => {
            cb(module);
          });
        });
      });
    },
    _import2(moduleInfo, cb) {
      import(`../../../../src/module/${moduleInfo.relativeName}/front/src/main.js`).then(instance => {
        cb(instance);
      }).catch(err => {
        if (err.message.indexOf('/front/src/main.js') === -1) throw err;
        import(`../../build/__module/${moduleInfo.relativeName}/dist/front.js`).then(() => {
          cb(window[moduleInfo.relativeName]);
        });
      });
    },
    requireAll() {
      // local
      rLocalJSs.keys().every(key => {
        const moduleInfo = mparse.parseInfo(mparse.parseName(key));
        const module = this._get(moduleInfo.relativeName);
        if (!module) {
          this._requireJS(rLocalJSs, key, moduleInfo);
        }
      });
      // global
      rGlobalJSs.keys().every(key => {
        const moduleInfo = mparse.parseInfo(mparse.parseName(key));
        const module = this._get(moduleInfo.relativeName);
        if (!module) {
          this._requireGlobalCSSJS(key, moduleInfo);
        }
      });
    },
    _require(moduleInfo, cb) {
      let key = this._requireFindKey(rLocalJSs, moduleInfo.relativeName);
      if (key) {
        this._requireJS(rLocalJSs, key, moduleInfo, cb);
      } else {
        key = this._requireFindKey(rGlobalJSs, moduleInfo.relativeName);
        if (key) {
          this._requireGlobalCSSJS(key, moduleInfo, cb);
        } else {
          throw new Error(`Module ${moduleInfo.relativeName} not exists`);
        }
      }
    },
    _requireFindKey(r, moduleRelativeName) {
      return r.keys().find(key => {
        const moduleInfo = mparse.parseInfo(mparse.parseName(key));
        return moduleRelativeName === moduleInfo.relativeName;
      });
    },
    _requireGlobalCSSJS(key, moduleInfo, cb) {
      this._requireJS(rGlobalJSs, key, moduleInfo, cb);
    },
    _requireCSS(r, key) {
      return r(key);
    },
    _requireJS(r, key, moduleInfo, cb) {
      // instance
      const instance = r(key);
      // install
      this.install(instance, moduleInfo, module => {
        // custom css, must after instance installed
        const keyCss = this._requireFindKey(rCustomCSSs, moduleInfo.relativeName);
        if (keyCss) {
          this._requireCSS(rCustomCSSs, keyCss);
        }
        // ok
        cb && cb(module);
      });
    },
    _registerRoutes(module) {
      if (!module.options.routes) return null;
      const routes = module.options.routes.map(route => {
        Vue.prototype.$meta.util.setComponentModule(route.component, module);
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
      Object.keys(module.options.components).forEach(key => {
        const component = module.options.components[key];
        if (!component.meta || component.meta.component !== false) {
          Vue.prototype.$meta.util.setComponentModule(component, module);
          if (!component.meta || component.meta.global !== false) {
            Vue.component(key, component);
          }
        }
      });
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
        Vue.prototype.$utils.extend(Vue.prototype.$meta.config, module.options.config);
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
