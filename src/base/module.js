import mparse from 'egg-born-mparse';

export default function(Vue) {
  const module = {
    importCSS(moduleInfo, cb) {
      System.import('../../build/__module/' + moduleInfo.fullName + '/dist/front.css').then(() => {
        return cb(null);
      }).catch(e => {
        return cb(e);
      });
    },
    importJS(moduleInfo, cb) {
      System.import('../../build/__module/' + moduleInfo.fullName + '/dist/front.js').then(m => {
        return cb(null, m);
      }).catch(() => {
        System.import('../../../../src/module/' + moduleInfo.relativeName + '/front/src/main.js').then(m => {
          return cb(null, m);
        }).catch(e => {
          return cb(e);
        });
      });
    },
    requireCSS(moduleRelativeName) {
      const r = require.context('../../build/__module/', true, /-sync\/dist\/front\.css$/);
      r.keys().forEach(key => {
        const moduleInfo = mparse.parseInfo(mparse.parseName(key));
        if (!this.getModule(moduleInfo.relativeName)) {
          if (!moduleRelativeName || moduleRelativeName === moduleInfo.relativeName) r(key);
        }
      });
    },
    requireJS(moduleRelativeName, local, cb) {
      const r = local ?
        require.context('../../../../src/module/', true, /-sync\/front\/src\/main\.js$/) :
        require.context('../../build/__module/', true, /-sync\/dist\/front\.js$/);
      r.keys().forEach(key => {
        const moduleInfo = mparse.parseInfo(mparse.parseName(key));
        if (!this.getModule(moduleInfo.relativeName)) {
          const m = r(key);

          modules[moduleInfo.fullName] = m;
          cb(m, moduleInfo);
        }
      });
    },
    requireModules(cb) {
      this.requireCSS();
      this.requireJS(this.requireJS({}, false, cb), true, cb);
    },
    requireModule(moduleRelativeName) {
      this.requireCSS(moduleRelativeName);
      let module = this.requireJS(moduleRelativeName, false);
      if (!module) module = this.requireJS(moduleRelativeName, true);
      return module;
    },
    registerModuleResources(options, moduleInfo, Vue) {
      options.store && this.registerStore(options.store, moduleInfo, Vue);
      options.config && this.registerConfig(options.config, moduleInfo, Vue);
      options.locales && this.registerLocales(options.locales, moduleInfo, Vue);
    },
    registerStore(store, moduleInfo, Vue) {
      if (!Vue.prototype.$meta.store._modulesNamespaceMap[`${moduleInfo.pid}/`]) {
        Vue.prototype.$meta.store.registerModule(moduleInfo.pid, {
          namespaced: true,
        });
      }
      store.namespaced = true;
      Vue.prototype.$meta.store.registerModule([ moduleInfo.pid, moduleInfo.name ], store);
    },
    registerConfig(config, moduleInfo, Vue) {
      if (Vue.prototype.$meta.config.modules[moduleInfo.relativeName]) { extend(true, config, Vue.prototype.$meta.config.modules[moduleInfo.relativeName]); }
      Vue.prototype.$meta.config.modules[moduleInfo.relativeName] = config;
    },
    registerLocales(locales, moduleInfo, Vue) {
      Object.keys(locales).forEach(key => {
        if (Vue.prototype.$meta.locales[key]) { extend(true, locales[key], Vue.prototype.$meta.locales[key]); }
        Vue.prototype.$meta.locales[key] = locales[key];
      });
    },
    overrideProperty({ obj, key, objBase, vueComponent, combilePath }) {
      Object.defineProperty(obj, key, {
        get() {
          return function() {
            const moduleInfo = vueComponent.moduleInfo;
            const args = new Array(arguments.length);
            args[0] = combilePath(moduleInfo, arguments[0]);
            for (let i = 1; i < args.length; i++) {
              args[i] = arguments[i];
            }
            return objBase[key].apply(objBase, args);
          };
        },
      });
    },
    removeAppLoading() {
    // eslint-disable-next-line
    const loading = window.document.getElementById('app-loading');
      loading && loading.parentNode.removeChild(loading);
    },
    get(moduleRelativeName) {
      return Vue.prototype.$meta.modules[moduleRelativeName];
    },
    set(moduleRelativeName, module) {
      Vue.prototype.$meta.modules[moduleRelativeName] = module;
    },
    use(moduleName, cb) {
      const moduleInfo = mparse.parseInfo(moduleName);
      if (!moduleInfo) throw new Error('invalid module name!');
      const module = this.getModule(moduleInfo.relativeName);
      if (module) return cb(module);

      if (moduleInfo.sync) {

      }
    },
  };

  return module;
}

