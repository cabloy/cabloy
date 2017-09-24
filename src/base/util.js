/*
* @Author: zhennann
* @Date:   2017-09-12 21:18:27
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-24 17:59:07
*/
import moduleUtil from './module-util.js';

export default {

  importCSS(moduleInfo, cb) {
      import('../../build/__module/' + moduleInfo.fullName + '/dist/front.css').then(() => {
        return cb(null);
      }).catch(e => {
        return cb(e);
      });
  },

  importJS(moduleInfo, cb) {
      import('../../build/__module/' + moduleInfo.fullName + '/dist/front.js').then(m => {
        return cb(null, m);
      }).catch(() => {
        import('../../../../src/module/' + moduleInfo.relativeName + '/front/src/main.js').then(m => {
          return cb(null, m);
        }).catch(e => {
          return cb(e);
        });
      });
  },

  requireCSS() {
    const r = require.context('../../build/__module/', true, /-sync\/dist\/front\.css$/);
    r.keys().forEach(key => r(key));
  },

  requireJS(modules, local, cb) {
    const r = local ?
      require.context('../../../../src/module/', true, /-sync\/front\/src\/main\.js$/) :
      require.context('../../build/__module/', true, /-sync\/dist\/front\.js$/);
    r.keys().forEach(key => {
      const moduleInfo = moduleUtil.parseInfo(moduleUtil.parseName(key));
      if (!modules[moduleInfo.fullName]) {
        const m = r(key);
        modules[moduleInfo.fullName] = m;
        cb(m, moduleInfo);
      }
    });
    return modules;
  },

  requireModules(cb) {
    this.requireCSS();
    this.requireJS(this.requireJS({}, false, cb), true, cb);
  },

  registerStore(store, moduleInfo, Vue) {
    if (store) {
      if (!Vue.prototype.$meta.store._modulesNamespaceMap[`${moduleInfo.pid}/`]) {
        Vue.prototype.$meta.store.registerModule(moduleInfo.pid, {
          namespaced: true,
        });
      }
      store.namespaced = true;
      Vue.prototype.$meta.store.registerModule([ moduleInfo.pid, moduleInfo.name ], store);
    }
  },

  overrideProperty({ obj, key, objBase, vueComponent, combilePath }) {
    Object.defineProperty(obj, key, {
      get() {
        return function() {
          const moduleInfo = __getModuleInfo(vueComponent);
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

  getModuleInfo: __getModuleInfo,
};

function __getModuleInfo(vueComponent) {
  if (!vueComponent.__ebModuleInfo) {
    vueComponent.__ebModuleInfo = moduleUtil.parseInfo(vueComponent.$route.path);
  }
  return vueComponent.__ebModuleInfo;
}
